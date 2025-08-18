// app/api/assign-plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { assignPlanToUser } from "@/sanity/lib/Payments/getPaymentsPlan";

export async function POST(request: NextRequest) {
  try {
    const { userId, planId, setCreditsFromPlan } = await request.json();

    if (!userId || !planId) {
      return NextResponse.json(
        { error: "Missing userId or planId" },
        { status: 400 }
      );
    }

    const updatedUser = await assignPlanToUser(userId, planId, {
      setCreditsFromPlan: setCreditsFromPlan,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error("Error assigning plan:", err);
    return NextResponse.json(
      { error: "Failed to assign plan" },
      { status: 500 }
    );
  }
}
