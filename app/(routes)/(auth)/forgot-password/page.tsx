import { auth } from "@/auth";
import { MainContainer } from "@/components/layout/MainContainer";
import { FormEmailSend } from "@/components/LoginComponents/FormEmailSend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <MainContainer className="flex flex-col items-center justify-center h-screen px-4">
      <Card className="w-full max-w-lg shadow-xl p-4 py-10 relative">
        <Button asChild variant={"ghost"} className="absolute left-2 top-2">
          <Link href="/login">
            <ArrowLeft />
          </Link>
        </Button>

        <CardHeader className="gap-2 mb-4">
          <CardTitle className="text-2xl font-bold mb-2 text-center">
            Restablecer contraseña
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <FormEmailSend />
        </CardContent>
      </Card>
    </MainContainer>
  );
}
