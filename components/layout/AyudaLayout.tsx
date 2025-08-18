import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AyudaLayout = () => {
  return (
    <Tabs defaultValue="ayuda" className="min-w-full w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="ayuda">Ayuda</TabsTrigger>
        <TabsTrigger value="terminos">Terminos y Condicones</TabsTrigger>
        <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
      </TabsList>

      {/* TAB: AYUDA */}
      <TabsContent value="ayuda">
        <Accordion type="single" collapsible defaultValue={"soporte"}>
          <AccordionItem value="soporte">
            <AccordionTrigger>Soporte</AccordionTrigger>
            <AccordionContent className="bg-muted p-4 rounded-lg">
              Si tienes dudas adicionales sobre los términos o privacidad,
              visita nuestra sección de ayuda en{" "}
              <span className="font-semibold">/ayuda</span>.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      {/* TAB: TÉRMINOS */}
      <TabsContent value="terminos">
        <Accordion type="single" collapsible>
          <AccordionItem value="uso">
            <AccordionTrigger>Uso del servicio</AccordionTrigger>
            <AccordionContent className="bg-muted p-4 rounded-lg">
              El uso de esta plataforma implica la aceptación de las condiciones
              aquí descritas. Se prohíbe cualquier actividad ilegal o no
              autorizada.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="responsabilidad">
            <AccordionTrigger>Responsabilidad</AccordionTrigger>
            <AccordionContent className="bg-muted p-4 rounded-lg">
              El usuario es responsable de la veracidad de la información
              proporcionada y del uso correcto de la plataforma.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>

      {/* TAB: PRIVACIDAD */}
      <TabsContent value="privacidad">
        <Accordion type="single" collapsible>
          <AccordionItem value="datos">
            <AccordionTrigger>Protección de datos</AccordionTrigger>
            <AccordionContent className="bg-muted p-4 rounded-lg">
              Respetamos tu privacidad conforme a la legislación mexicana (Ley
              Federal de Protección de Datos Personales en Posesión de los
              Particulares). La información personal será usada únicamente para
              los fines indicados.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cookies">
            <AccordionTrigger>Cookies</AccordionTrigger>
            <AccordionContent className="bg-muted p-4 rounded-lg">
              Este sitio puede utilizar cookies para mejorar la experiencia del
              usuario. Puedes deshabilitarlas desde tu navegador.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  );
};
