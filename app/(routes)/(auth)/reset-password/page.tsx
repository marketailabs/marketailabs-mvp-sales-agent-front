import { MainContainer } from "@/components/layout/MainContainer";
import { FormResetPassword } from "@/components/LoginComponents/FormResetPassword";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { verifyToken } from "@/actions/auth-actions";
import { TokenMessage } from "@/components/LoginComponents/TokenMessage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  if (token) {
    const tokenData = await verifyToken(token);

    return (
      <MainContainer className="flex flex-col items-center justify-center h-screen px-4">
        <Card className="w-full max-w-md relative">
          <Button asChild variant={"ghost"} className="absolute left-2 top-2">
            <Link href="/login">
              <ArrowLeft />
            </Link>
          </Button>

          <CardHeader>
            <CardTitle className="text-2xl font-bold mb-2 text-center">
              Restablecer contraseña
            </CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Introduce una nueva contraseña segura. Asegúrate de no reutilizar
              contraseñas anteriores.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <TokenMessage token={tokenData} />

            <FormResetPassword token={token} />

            <div className="flex justify-center">
              <Link
                href="/"
                className="text-xs text-center text-primary underline"
              >
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </MainContainer>
    );
  }

  return (
    <MainContainer className="flex flex-col items-center justify-center h-screen px-4">
      <div className="text-center flex flex-col items-center gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h1 className="text-2xl font-bold">Token no válido o expirado</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          El enlace de restablecimiento ha expirado o es incorrecto. Puedes
          solicitar uno nuevo desde la página de inicio.
        </p>

        <div className="flex justify-center">
          <Link href="/" className="text-xs text-center text-primary underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </MainContainer>
  );
}
