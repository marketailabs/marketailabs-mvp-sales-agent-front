import { FormSend } from "@/components/FormSend";
import { HeroText } from "@/components/layout/HeroText";
import { Sidebar } from "@/components/layout/Sidebar";
import { LogoComponent } from "@/components/LogoComponent";
import { getForms } from "@/sanity/lib/Form/getForm";
import { getIntro } from "@/sanity/lib/Intro/getIntro";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Prospector Assistant",
};

export default async function AsistenteIAPage() {
  const forms = await getForms();
  const introData = await getIntro();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />

      <main className="flex-1 relative font-sans">
        <div className="absolute top-1 right-4 hidden lg:flex flex-col items-end py-4">
          <LogoComponent />
        </div>

        <HeroText introOption={1} introData={introData} />
        <FormSend formOption={1} formSanity={forms} />
      </main>
    </div>
  );
}
