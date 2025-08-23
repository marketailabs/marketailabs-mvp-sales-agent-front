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

    // activar el flag
    const flagResult = await setApplyingFreePlan(userId, true);

    // si no se pudo setear correctamente, cortar el flujo
    if (!flagResult.success) {
      return NextResponse.json(
        {
          error: "No se pudo setear applyingFreePlan",
          detail: flagResult.error,
        },
        { status: 500 }
      );
    }

    // Continuamos con la cancelación
    const cancelResult = await handleCancelStripeSubscription(
      user.subscriptionId
    );

    if ("error" in cancelResult) {
      return NextResponse.json({ error: cancelResult.error }, { status: 500 });
    }

    // asignar plan gratuito
    const updatedUser = await assignFreePlanToUser(userId);

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error assigning plan:", err);
    return NextResponse.json(
      { error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
