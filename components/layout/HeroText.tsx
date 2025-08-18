import { GetIntroQueryResult } from "@/sanity.types";

export const HeroText = async ({
  introOption,
  introData,
}: {
  introOption: number;
  introData: GetIntroQueryResult;
}) => {
  const intro = introData[introOption];

  return (
    <section className="flex flex-col px-8 w-full mt-20">
      <h1 className="text-[44px] lg:text-[66px] text-center lg:text-start font-medium tracking-tight leading-[1.1]">
        <span className="block">{intro.title}</span>
      </h1>
      <p className="mt-4 text-justify text-lg mx-auto grid space-y-6">
        {intro.parrafo1 && <span>{intro.parrafo1}</span>}

        {intro.parrafo2 && <span>{intro.parrafo2}</span>}
      </p>
    </section>
  );
};
