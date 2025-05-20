import FormSend from "@/components/FormSend";
import LogoComponent from "@/components/LogoComponent";

export default function Home() {
  return (
    <main className="flex-1 relative font-sans">
      <div className="absolute hidden md:block top-4 right-4">
        <LogoComponent />
      </div>

      <section className="flex flex-col px-8 py-12 md:py-32 md:px-8 mx-auto max-w-2xl lg:max-w-4xl h-full">
        <h1 className="flex flex-col md:gap-3 md:flex-row text-[36px] lg:text-[50px] text-center lg:text-start font-medium tracking-tight leading-[1.1]">
          <span className="block">¡Bienvenido a nuestro</span>
          <span> Asistente AI!</span>
        </h1>
        <p className="mt-4 mb-12 text-center md:text-start text-lg mx-auto">
          Para comenzar, por favor escribe al menos 300 palabras en el área de
          texto a continuación y proporciona tu correo electrónico para recibir
          tu respuesta personalizada.
        </p>

        <FormSend />
      </section>
    </main>
  );
}
