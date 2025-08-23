import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import {
  handleCancelStripeSubscription,
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "@/actions/payment-actions";
import {
  getSanityUserById,
  getUserByCustomerId,
} from "@/sanity/lib/User/UserCredits";
import { getUserByEmail } from "@/sanity/lib/User/getUserByEmail";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("No STRIPE_WEBHOOK_SECRET in env");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.error("⚠️  Webhook signature verification failed.", err?.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err?.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Solo para subscripciones (tu checkout lo crea en mode subscription)
        // en tu handler checkout.session.completed

        const userIdOfMeta = session.metadata?.userId ?? null;

        if (!userIdOfMeta) {
          throw new Error("No userId in metadata");
        }

        const user = await getSanityUserById(userIdOfMeta);

        if (!user) {
          throw new Error("No user found");
        }

        if (user.subscriptionId) {
          handleCancelStripeSubscription(user.subscriptionId);
        }

        if (session.mode === "subscription") {
          await handleCheckoutSessionCompleted(session);
        }

        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        await handleInvoicePaid(invoice);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer?.id ?? null;

        let user = null;

        if (subscription.metadata.userId) {
          user = await getSanityUserById(subscription.metadata.userId);
        }

        if (!user && subscription.customer) {
          user = await getUserByCustomerId(customerId);
        }

        if (!user && subscription.metadata.email) {
          user = await getUserByEmail(subscription.metadata.email);
        }

        if (!user) {
          throw new Error("No user found");
        }

        if (user.applyingFreePlan === true) {
          console.log(
            "Ignorando customer.subscription.deleted por free plan",
            user.email,
            subscription.id
          );
        } else if (user.changePlan === true) {
          console.log(
            "Ignorando customer.subscription.deleted por cambio de plan",
            user.email,
            subscription.id
          );
        } else {
          await handleSubscriptionDeleted(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      // opcional: manejar invoice.payment_failed, customer.updated, etc
      default:
        console.log("Unhandled event type:", event.type);
    }
  } catch (err) {
    console.error("Error handling webhook event", err);
    // no tirar error 500 si falló en el handler? mejor devolver 500 así Stripe reintentará.
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
