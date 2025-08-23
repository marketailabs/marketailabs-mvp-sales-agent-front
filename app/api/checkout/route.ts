import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getSanityUserById } from "@/sanity/lib/User/UserCredits";
import baseUrl from "@/lib/baseUrl";
import {
  setApplyingChangePlan,
  setApplyingFreePlan,
} from "@/sanity/lib/Payments/getPaymentsPlan";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { price_id, userData, planCredits } = body;
    const { email, userId } = userData || {};

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing userId or email in request" },
        { status: 400 }
      );
    }

    if (!price_id || !price_id.startsWith("price_")) {
      return NextResponse.json(
        { error: "A valid priceId (price_...) is required" },
        { status: 400 }
      );
    }

    // intentar reusar customerId existente en Sanity
    let customerParam: string | undefined;
    try {
      const sanityUser = await getSanityUserById(userId);
      if (sanityUser?.customerId) customerParam = sanityUser.customerId;
    } catch (err) {
      console.warn("No se pudo obtener customerId de Sanity:", err);
    }

    // Dar el flag que se esta haciendo el cambio de plan y por si acaso quitar el flag de free
    await setApplyingFreePlan(userId, false);
    await setApplyingChangePlan(userId, true);

    // crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      mode: "subscription",
      line_items: [{ price: price_id, quantity: 1 }],
      ...(customerParam
        ? { customer: customerParam }
        : { customer_email: email }),
      metadata: {
        userId,
        email,
        planCredits: String(planCredits ?? ""),
        resolvedPriceId: price_id,
      },
      subscription_data: {
        metadata: {
          userId,
          email,
          planCredits: String(planCredits ?? ""),
          resolvedPriceId: price_id,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Error al crear sesión de checkout:", err);
    const status = err?.statusCode || 500;
    const message =
      err?.message || "Error al crear sesión de checkout (server error)";
    return NextResponse.json({ error: message }, { status });
  }
}
