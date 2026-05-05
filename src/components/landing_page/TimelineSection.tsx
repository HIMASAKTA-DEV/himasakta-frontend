import HeaderSection from "../commons/HeaderSection";
import Image from "next/image";

const TimelineSection = () => {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-start">
        <div className="flex flex-col items-center justify-center w-full">
          <HeaderSection title={"Sejarah Himpunan"} />
          <Image
            src={"/docs/TimelineUtama.png"}
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
