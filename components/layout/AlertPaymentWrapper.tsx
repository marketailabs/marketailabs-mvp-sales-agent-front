import { auth } from "@/auth";
import { getUserByEmail } from "@/sanity/lib/User/getUserByEmail";
import { AlertPayment } from "./AlertPayment";

export const AlertPaymentWrapper = async () => {
  const session = await auth();
  const user = await getUserByEmail(session?.user?.email || "");

  return <AlertPayment subscriptionStatus={user?.subscriptionStatus ?? null} />;
};
