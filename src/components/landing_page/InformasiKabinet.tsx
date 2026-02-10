import Image from "next/image";
import HeaderSection from "../commons/HeaderSection";

export default function InformasiKabinet() {
  return (
    <section className="w-full flex flex-col lg:flex-row  gap-8 lg:gap-24">
      <div className="order-2 lg:order-1 flex flex-col gap-4">
        <HeaderSection
          title="Informasi Kabinet"
          sub="Lorem ipsum dolor sit amet constectur"
        />
        <p className="font-libertine lg:text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore aliqua. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore aliqua. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        </p>
        <h1 className="font-libertine font-bold lg:text-2xl">
          Lorem ipsum dolor sit amet
        </h1>
        <ul></ul>
      </div>
      <Image
        src="/images/InformasiKabinet.png"
        alt="profil-himpunan"
        width={402}
        height={569}
        className="order-1 lg:order-2 rounded-3xl hidden lg:inline-block"
      />
      <div className="lg:hidden w-full relative aspect-[16/12]">
        <Image
          src="/images/InformasiKabinet.png"
          alt="profil-himpunan"
          fill
          className="order-1 lg:order-2 rounded-3xl object-cover object-center"
        />
      </div>
    </section>
  );
}
