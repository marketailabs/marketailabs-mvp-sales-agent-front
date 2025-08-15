// app/api/stripe-webhook/route.ts (fragmento)
import { changeUserPlanAndAddCredits } from "@/actions/payment-actions";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      endpointSecret
    );
  } catch (err) {
    console.error("Invalid signature:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const metadata = session.metadata || {};
        const userId = metadata.userId ?? undefined;
        const email = metadata.email ?? undefined;
        const priceId = metadata.priceId ?? undefined;
        const planCredits = metadata.planCredits ?? undefined;
        const subscriptionId = session.subscription ?? undefined;
        const paymentIntent = session.payment_intent ?? undefined;
        const invoiceId = paymentIntent ?? session.id;

        await changeUserPlanAndAddCredits({
          userId,
          email,
          priceId,
          planCredits,
          subscriptionId,
          invoiceId,
          setCreditsFromPlan: false, // o true si querés reemplazar credits por los del plan
        });

        console.log("checkout.session.completed handled", session.id);
        break;
      }

      case "invoice.payment_succeeded": {
        // lógica similar: recuperar subscription metadata para userId y llamar changeUserPlanAndAddCredits con invoiceId
        const invoice = event.data.object as any;
        const invoiceId = invoice.id;
        const subscriptionId = invoice.subscription;
        const priceId = invoice.lines?.data?.[0]?.price?.id ?? undefined;
        const customerEmail = invoice.customer_email ?? undefined;

        // intentar leer userId desde subscription metadata
        let userIdFromSub = undefined;
        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            userIdFromSub = sub.metadata?.userId ?? undefined;
          } catch (err) {
            console.warn("Could not retrieve subscription metadata", err);
          }
        }

        await changeUserPlanAndAddCredits({
          userId: userIdFromSub,
          email: userIdFromSub ? undefined : customerEmail,
          priceId,
          planCredits: undefined,
          subscriptionId,
          invoiceId,
          setCreditsFromPlan: false,
        });

        console.log("invoice.payment_succeeded handled", invoiceId);
        break;
      }

      default:
        console.log("Unhandled event", event.type);
    }
  } catch (err) {
    console.error("Error handling event:", err);
    return new Response("Handler error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
