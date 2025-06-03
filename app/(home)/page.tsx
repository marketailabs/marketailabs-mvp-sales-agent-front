import FormSend from "@/components/FormSend";
import LogoComponent from "@/components/LogoComponent";
import HeroText from "@/components/layout/HeroText";
import { Sidebar } from "@/components/layout/Sidebar";
import { getForms } from "@/sanity/lib/Form/getForm";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Home() {
  const forms = await getForms();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 relative font-sans">
        <div className="absolute top-1 right-4 hidden lg:flex flex-col items-end py-4">
          <LogoComponent />
        </div>

        <HeroText />
        <FormSend formSanity={forms} />
      </main>
    </div>
  );
}
