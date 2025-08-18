import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import baseUrl from "@/lib/baseUrl";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { priceId, userData, planCredits, name, description } = body;
    const { email, userId } = userData || {};

    if (!priceId) {
      return NextResponse.json(
        { error: "No priceId provided for subscription" },
        { status: 400 }
      );
    }

    let resolvedPriceId: string | undefined = priceId;

    // Si nos pasaron un product id (prod_...), buscamos un price activo asociado
    if (resolvedPriceId?.startsWith("prod_")) {
      const prices = await stripe.prices.list({
        product: resolvedPriceId,
        active: true,
        limit: 10,
      });

      if (!prices || !prices.data || prices.data.length === 0) {
        return NextResponse.json(
          { error: `No active price found for product ${resolvedPriceId}` },
          { status: 400 }
        );
      }

      // Preferimos un price recurrente (subscription). Si querés filtrar por mensual,
      // usá: .find(p => p.recurring?.interval === "month")
      const recurring = prices.data.find((p) => !!p.recurring);
      const chosen = recurring ?? prices.data[0];
      resolvedPriceId = chosen.id; // price_...
    }

    // A esta altura resolvedPriceId debería ser price_...
    if (!resolvedPriceId || !resolvedPriceId.startsWith("price_")) {
      return NextResponse.json(
        { error: "Could not resolve a valid price_id (price_...)" },
        { status: 400 }
      );
    }

    // Crear sesión de checkout de suscripción
    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      mode: "subscription",
      customer_email: email ?? undefined,
      metadata: {
        userId: userId ?? "",
        email: email ?? "",
        planCredits: String(planCredits ?? ""),
        priceId: priceId ?? "", // guardamos lo que vino (puede ser prod_ o price_)
      },
      subscription_data: {
        metadata: {
          userId: userId ?? "",
          email: email ?? "",
          planCredits: String(planCredits ?? ""),
          priceId: priceId ?? "",
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
