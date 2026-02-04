import { MainContainer } from "@/components/layout/MainContainer";
import LegalTabs from "@/components/LegalSections";
import { legalInfoQuery } from "@/sanity/lib/Legal/getLegalInfo";
import { sanityFetch } from "@/sanity/lib/live";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Page() {
  const { data: LegalInfoArray } = await sanityFetch({ query: legalInfoQuery });

  return (
    <MainContainer className="pt-16 md:pt-24 px-4">
      <LegalTabs sections={LegalInfoArray} />
    </MainContainer>
  );
}
