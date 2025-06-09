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
    <section className="flex flex-col px-8 mx-auto max-w-2xl lg:max-w-4xl mt-24">
      <h1 className="text-[38px] lg:text-[56px] text-center lg:text-start font-medium tracking-tight leading-[1.1]">
        <span className="block">{intro.title}</span>
      </h1>
      <p className="mt-4 text-justify mb-6 text-lg mx-auto grid space-y-6">
        {intro.parrafo1 && <span>{intro.parrafo1}</span>}

        {intro.parrafo2 && <span>{intro.parrafo2}</span>}
      </p>
    </section>
  );
};
