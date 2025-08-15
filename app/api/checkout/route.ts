import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import baseUrl from "@/lib/baseUrl";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    price,
    name,
    description,
    typeOfPlan,
    planCredits,
    userData,
    priceId,
  } = body;
  const { email, userId } = userData || {};

  console.log("body", body);
  console.log("Enviando a stripe");

  const isSubscription = typeOfPlan === "mensual";

  // Usamos undefined en lugar de null para mejor compatibilidad con TS
  let resolvedPriceId: string | undefined = priceId ?? undefined;

  try {
    // Si recibimos un product id (prod_), buscar un price activo asociado
    if (resolvedPriceId && resolvedPriceId.startsWith("prod_")) {
      console.log(
        "priceId parece ser un product id, buscando price activo para el product..."
      );
      const prices = await stripe.prices.list({
        product: resolvedPriceId,
        active: true,
        limit: 1,
      });

      if (!prices || !prices.data || prices.data.length === 0) {
        console.error(
          `No se encontró ningún price activo para el product ${resolvedPriceId}`
        );
        return NextResponse.json(
          { error: `No active price found for product ${resolvedPriceId}` },
          { status: 400 }
        );
      }

      resolvedPriceId = prices.data[0].id; // ej: price_XXXXXXXX
      console.log("Resolved priceId:", resolvedPriceId);
    }

    // si es subscripción, obligamos a tener un price_...
    if (isSubscription && !resolvedPriceId) {
      return NextResponse.json(
        { error: "No priceId provided for subscription" },
        { status: 400 }
      );
    }

    // Construimos line_items ya sabiendo que si es suscripción, resolvedPriceId existe (TS lo entiende tras la validación)
    const line_items = isSubscription
      ? [
          {
            price: resolvedPriceId!,
            quantity: 1,
          },
        ]
      : [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name,
                description,
              },
              unit_amount: Math.round(Number(price) * 100),
            },
            quantity: 1,
          },
        ];

    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      line_items,
      metadata: {
        typeOfPlan,
        userId,
        planCredits,
        email,
        priceId: priceId ?? "",
      },
      mode: isSubscription ? "subscription" : "payment",
      ...(isSubscription
        ? {
            // metadata dentro de la subscription para que futuras invoices lo hereden
            subscription_data: {
              metadata: {
                userId,
                email,
                priceId: priceId ?? "",
                planCredits: String(planCredits ?? ""),
              },
            },
          }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Error al crear sesión de checkout:", err);

    if (
      err?.type === "StripeInvalidRequestError" ||
      err?.rawType === "invalid_request_error"
    ) {
      return NextResponse.json(
        { error: err.message || "Stripe: invalid request" },
        { status: err.statusCode || 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear sesión de checkout" },
      { status: 500 }
    );
  }
}
