import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="max-w-6xl mx-auto py-4 pt-12 px-4 mt-full flex flex-col gap-1 text-center items-center justify-center w-full text-gray-500 dark:text-gray-400">
      <p className="text-xs">
        MarketAI Labs (marca representada por José Salvador Zárate Nolasco, RFC
        ZANS820221RW2) recolecta Datos de Identificación, Contacto, Facturación
        y Datos Técnicos para prestar y facturar servicios SaaS, así como para
        gestionar sus suscripciones mensuales. Procesamos pagos mediante Stripe
        y usamos Google Analytics. o escriba a marketailabs@gmail.com.
      </p>

      <p className="text-xs">
        Para conocer el Aviso de Privacidad Integral y ejercer sus derechos ARCO
        visite{" "}
        <Link
          href="/ayuda"
          className="underline hover:text-gray-600 dark:hover:text-gray-300"
        >
          www.marketailabs.com/ayuda
        </Link>{" "}
        o escriba a marketailabs@gmail.com.
      </p>
    </footer>
  );
};
