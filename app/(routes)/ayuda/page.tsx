import { MainContainer } from "@/components/layout/MainContainer";
import LegalTabs from "@/components/LegalSections";
import { getLegalInfo } from "@/sanity/lib/Legal/getLegalInfo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Page() {
  const LegalInfoArray = await getLegalInfo();

  console.log(LegalInfoArray);

  return (
    <MainContainer className="pt-16 md:pt-24 px-4">
      <LegalTabs sections={LegalInfoArray} />
    </MainContainer>
  );
}
