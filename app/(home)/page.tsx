import { FormSend } from "@/components/FormSend";
import { LogoComponent } from "@/components/LogoComponent";
import { HeroText } from "@/components/layout/HeroText";
import { Sidebar } from "@/components/layout/Sidebar";
import { getForms } from "@/sanity/lib/Form/getForm";
import { getIntro } from "@/sanity/lib/Intro/getIntro";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function HomePage() {
  const forms = await getForms();
  const introData = await getIntro();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 relative font-sans mt-4 md:mt-0 md:ml-17">
        <div className="absolute top-1 right-4 hidden md:flex flex-col items-end py-4">
          <LogoComponent />
        </div>

        <HeroText introOption={0} introData={introData} />
        <FormSend formOption={0} formSanity={forms} />
      </main>
    </div>
  );
}
