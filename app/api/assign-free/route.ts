import { NextRequest, NextResponse } from "next/server";
import { getSanityUserById } from "@/sanity/lib/User/UserCredits";
import { handleCancelStripeSubscription } from "@/actions/payment-actions";
import {
  assignFreePlanToUser,
  setApplyingFreePlan,
} from "@/sanity/lib/Payments/getPaymentsPlan";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // obtener el usuario
    const user = await getSanityUserById(userId);

    // activamos el flag para evitar que el webhook sobrescriba
    await setApplyingFreePlan(userId, true);

    // cancelar el plan actual
    const cancelResult = await handleCancelStripeSubscription(
      user.subscriptionId
    );

    // si falló, no seguimos
    if ("error" in cancelResult) {
      return NextResponse.json({ error: cancelResult.error }, { status: 500 });
    }

    // recién acá asignamos el plan gratuito
    const updatedUser = await assignFreePlanToUser(userId);

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Error assigning plan:", err);
    return NextResponse.json(
      { error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
