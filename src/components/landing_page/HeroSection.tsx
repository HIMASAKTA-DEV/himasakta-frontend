import { ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ButtonLink from "../links/ButtonLink";
import { navBtnData } from "./_navBtnHeroSection/navBtnData";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[550px] lg:h-[750px] overflow-hidden">
      <Image
        src="/images/HeroImage.png"
        alt="hero-image"
        fill
        priority
        className="
          object-cover
          object-center
          [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]
          [-webkit-mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]
        "
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primaryPink/80 via-primaryPink/60 to-transparent" />

      {/* Ini bagian Title */}
      <div className="relative z-499 flex h-full items-center px-12 lg:px-32 font-libertine">
        <div className="flex flex-col gap-6">
          <h1 className="text-white text-4xl lg:text-6xl font-bold">
            Selamat Datang
          </h1>
          <h1 className="text-white text-4xl lg:text-6xl font-bold">
            di laman HIMASAKTA
          </h1>
          <div className="flex items-center gap-4">
            {navBtnData.map((item) => (
              <ButtonLink
                href={item.url}
                variant="outline"
                className="border-none bg-white rounded-md gap-1 flex items-center transition-all duration-200"
              >
                <span className="text-black transition-colors">
                  {item.name}
                </span>

                <ChevronRightIcon
                  className="w-5 h-5 text-black transition-colors duration-200 hover:text-green-500
                  "
                />
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
