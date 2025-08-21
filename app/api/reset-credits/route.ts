import { client } from "@/sanity/lib/client";

export async function POST(req: Request) {
  const { userId, planCredits } = await req.json();

  try {
    const patch = await client
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
