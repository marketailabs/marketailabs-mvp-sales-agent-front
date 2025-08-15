import { FormSend } from "@/components/FormSend";
import { HeroText } from "@/components/layout/HeroText";
import { MainContainer } from "@/components/layout/MainContainer";
import { getForms } from "@/sanity/lib/Form/getForm";
import { getIntro } from "@/sanity/lib/Intro/getIntro";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function HomePage() {
  const forms = await getForms();
  const introData = await getIntro();

  return (
    <MainContainer>
      <HeroText introOption={0} introData={introData} />
      <FormSend formOption={0} formSanity={forms} />
    </MainContainer>
  );
}
