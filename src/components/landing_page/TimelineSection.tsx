import Image from "next/image";
import HeaderSection from "../commons/HeaderSection";

const TimelineSection = ({ fotoSejarah }: { fotoSejarah?: string }) => {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-start">
        <div className="flex flex-col items-center justify-center w-full">
          <HeaderSection title={"Sejarah Himpunan"} />
          <Image
            src={fotoSejarah || "/docs/TimelineUtama.png"}
            alt="timeline"
            width={1080}
            height={720}
          />
        </div>
      </div>
    </>
  );
};

export default TimelineSection;
