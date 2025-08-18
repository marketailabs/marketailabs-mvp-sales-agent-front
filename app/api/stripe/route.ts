import { changeUserPlanAndAddCredits } from "@/actions/payment-actions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!endpointSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const body = await request.text();
  const sig =
    (await headers()).get("stripe-signature") ||
    (await headers()).get("Stripe-Signature") ||
    "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error("Invalid signature / constructEvent error:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const metadata = session.metadata ?? {};
        const userId = metadata.userId;
        const priceId = metadata.priceId;
        const subscriptionId = session.subscription ?? null;
        const customerId = session.customer ?? null;

        if (userId && priceId) {
          await changeUserPlanAndAddCredits({
            userId,
            priceId,
            subscriptionId,
            subscriptionStatus: "pending",
            customerId,
            setCreditsFromPlan: false, // todavía no aplicamos créditos
          });
        }

        console.log("Handled checkout.session.completed", session.id);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription ?? null;
        const priceId = invoice.lines?.data?.[0]?.price?.id ?? null;
        const invoiceId = invoice.id;

        let userIdFromSub: string | undefined;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          userIdFromSub = sub?.metadata?.userId ?? undefined;
        }

        if (userIdFromSub && priceId) {
          // Aplicar créditos correctamente usando el helper central
          await changeUserPlanAndAddCredits({
            userId: userIdFromSub,
            priceId,
            invoiceId,
            subscriptionId,
            subscriptionStatus: "active",
          });
        }

        console.log(
          "Handled invoice.payment_succeeded (credits added)",
          invoiceId
        );
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription ?? null;
        const customerId = invoice.customer ?? null;
        const invoiceId = invoice.id;

        let userIdFromSub: string | undefined;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          userIdFromSub = sub?.metadata?.userId ?? undefined;
        }

        if (userIdFromSub) {
          const freePlanId = "9080a077-b426-478d-9e08-1eeb5fe9ca07"; // Plan gratuito
          await changeUserPlanAndAddCredits({
            userId: userIdFromSub,
            planId: freePlanId,
            subscriptionId,
            subscriptionStatus: "past_due",
            invoiceId,
            customerId,
          });
        }

        console.log("Invoice payment failed:", invoiceId);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        const subscriptionId = sub.id;
        const status = sub.status;
        const priceId = sub.items?.data?.[0]?.price?.id ?? null;
        const userId = sub.metadata?.userId ?? undefined;
        const customerId = sub.customer ?? null;

        if (userId && priceId) {
          await changeUserPlanAndAddCredits({
            userId,
            priceId,
            subscriptionId,
            subscriptionStatus: status ?? null,
            customerId,
          });
        }

        console.log(
          "Handled subscription update/delete",
          subscriptionId,
          status
        );
        break;
      }

      default:
        console.log("Unhandled stripe event:", event.type);
    }
  } catch (err) {
    console.error("Error handling event:", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
