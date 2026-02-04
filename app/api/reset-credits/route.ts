import { adminClient } from "@/sanity/lib/adminClient";

export async function POST(req: Request) {
  const { userId, planCredits } = await req.json();

  try {
    const patch = await adminClient
      .patch(userId)
      .set({
        credits: planCredits,
        lastCreditsReset: new Date().toISOString(),
      })
      .commit();

    return Response.json({ success: true, user: patch });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, error: err }, { status: 500 });
  }
}
