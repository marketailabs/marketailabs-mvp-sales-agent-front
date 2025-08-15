import { MainContainer } from "@/components/layout/MainContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <MainContainer className="min-h-screen flex flex-col items-center justify-center">
      <Card className="p-6 max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-green-500/10 p-4 rounded-full mx-auto w-max">
            <CheckCircle className="size-16 text-green-500" />
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold">Pago exitoso</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu pago ha sido exitoso. Por favor, revisa que tus creditos se hayan
            cargado correctamente en tu cuenta.
          </p>

          <Button
            asChild
            className="mt-4 w-full bg-primary text-primary-foreground"
          >
            <Link href="/">Volver a la página principal</Link>
          </Button>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
