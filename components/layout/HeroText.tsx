import { getHome } from "@/sanity/lib/home/getHome";

const HeroText = async () => {
  const homeData = await getHome();

  return (
    <section className="flex flex-col px-8 mx-auto max-w-2xl lg:max-w-4xl mt-24">
      <h1 className="text-[36px] lg:text-[50px] text-center lg:text-start font-medium tracking-tight leading-[1.1]">
        <span className="block">{homeData?.title}</span>
      </h1>
      <p className="mt-4 mb-6 text-center md:text-start text-lg mx-auto grid space-y-6">
        <span>{homeData?.parrafo1}</span>

        <span>{homeData?.parrafo2}</span>
      </p>
    </section>
  );
};

export default HeroText;
