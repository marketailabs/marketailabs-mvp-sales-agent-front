import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="py-6 pt-12 px-4 mt-full text-sm flex flex-col items-center justify-center w-full text-gray-500 dark:text-gray-400">
      <p className="text-sm">© {new Date().getFullYear()} MarketIA Labs.</p>
      <Link
        href="/ayuda"
        className="ml-1 text-xs underline hover:text-gray-600 dark:hover:text-gray-300"
      >
        Términos y condiciones | Política de privacidad
      </Link>
    </footer>
  );
};
