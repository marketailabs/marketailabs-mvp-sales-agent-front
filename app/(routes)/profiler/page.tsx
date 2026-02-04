import { FormSend } from "@/components/FormSend";
import { HeroText } from "@/components/layout/HeroText";
import { MainContainer } from "@/components/layout/MainContainer";
import { formQuery } from "@/sanity/lib/Form/getForm";
import { introQuery } from "@/sanity/lib/Intro/getIntro";
import { sanityFetch } from "@/sanity/lib/live";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Profiler Express Assistant",
};

export default async function AsistenteIAPage() {
  const { data: formData } = await sanityFetch({
    query: formQuery,
  });
  const { data: introData } = await sanityFetch({
    query: introQuery,
  });

  return (
    <MainContainer>
      <HeroText introOption={0} introData={introData} />
      <FormSend formOption={0} formSanity={formData} />
    </MainContainer>
  );
}
