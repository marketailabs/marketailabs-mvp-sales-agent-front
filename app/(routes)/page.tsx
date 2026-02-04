import { FormSend } from "@/components/FormSend";
import { HeroText } from "@/components/layout/HeroText";
import { MainContainer } from "@/components/layout/MainContainer";
import { formQuery } from "@/sanity/lib/Form/getForm";
import { introQuery } from "@/sanity/lib/Intro/getIntro";
import { sanityFetch } from "@/sanity/lib/live";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function HomePage() {
  const { data: formData } = await sanityFetch({
    query: formQuery,
  });
  const { data: introData } = await sanityFetch({
    query: introQuery,
  });

  return (
    <MainContainer>
      <HeroText introOption={1} introData={introData} />
      <FormSend formOption={1} formSanity={formData} />
    </MainContainer>
  );
}
