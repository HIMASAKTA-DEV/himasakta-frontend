import HeaderSection from "../commons/HeaderSection";
import Image from "next/image";
import MarkdownRenderer from "../commons/MarkdownRenderer";
import { landingPageInfo } from "../../../config";

const TimelineSection = () => {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-start gap-4">
        <div className="flex flex-col items-center justify-center w-full">
          <HeaderSection title={"Sejarah Himpunan"} />
          <Image
            src={"/docs/TimelineUtama.png"}
            alt="timeline"
            width={1080}
            height={720}
          />
        </div>
        <div>
          <h1 className="font-libertine font-bold lg:text-3xl text-2xl mb-2">
            Visi:
          </h1>
          <MarkdownRenderer className="text-justify">
            {landingPageInfo.visi}
          </MarkdownRenderer>
          <h1 className="font-libertine font-bold lg:text-3xl text-2xl mt-6 mb-2">
            Misi:
          </h1>
          {landingPageInfo.misi.map((m, idx) => (
            <p className="font-libertine text-lg text-justify">{`${idx + 1}. ${m}`}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default TimelineSection;
