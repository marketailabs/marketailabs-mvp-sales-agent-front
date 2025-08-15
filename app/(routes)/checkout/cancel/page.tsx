import { MainContainer } from "@/components/layout/MainContainer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <MainContainer className="min-h-screen flex flex-col items-center justify-center">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-red-500/10 p-4 rounded-full mx-auto w-max">
            <XCircle className="size-16 text-red-500" />
          </CardTitle>
        </CardHeader>

        <CardContent className="mt-4 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold">Pago cancelado</h1>
          <p className="text-sm text-muted-foreground">
            Tu pago ha sido cancelado. Por favor, intenta nuevamente.
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
