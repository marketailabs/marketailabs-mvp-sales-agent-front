import FormSend from "@/components/FormSend";
import LogoComponent from "@/components/LogoComponent";

export default function Home() {
  return (
    <main className="flex-1 relative font-sans">
      <div className="absolute top-4 right-4 hidden md:flex flex-col items-end py-4">
        <LogoComponent />
      </div>
      <section className="flex flex-col px-8 py-12 md:py-24 md:px-8 mx-auto max-w-2xl lg:max-w-4xl h-full">
        <h1 className="flex flex-col md:gap-3 md:flex-row text-[36px] lg:text-[50px] text-center lg:text-start font-medium tracking-tight leading-[1.1]">
          <span className="block">¡Bienvenido a Prospector 🧠!</span>
        </h1>
        <p className="mt-4 mb-12 text-center md:text-start text-lg mx-auto grid space-y-4">
          <span>
            Conoce cómo es que tu prospecto toma decisiones de compra y elige
            tus recursos de venta personalizando su experiencia y potenciando tu
            oportunidad de cierre.
          </span>

          <span>
            Para comenzar, copia y pega debajo todos los mensajes de WhatsApp,
            correo, chats y textos que tu cliente te haya enviado. No importa el
            orden de las conversaciones, sólo asegúrate de no incluir
            información que no te haya sido enviada por él mismo. Necesitas 200
            palabras.
          </span>
        </p>

        <FormSend />
      </section>
    </main>
  );
}
