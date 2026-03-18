import { GlobalSettings } from "@/types/data/GlobalSettings";
import { CabinetInfo } from "@/types/data/InformasiKabinet";
import HeaderSection from "../commons/HeaderSection";
import MarkdownRenderer from "../commons/MarkdownRenderer";

interface AboutProps {
  webData: GlobalSettings | null;
  cabinetData: CabinetInfo | null;
}

function About({ webData, cabinetData }: AboutProps) {
  return (
    <section className="flex flex-col gap-12" id="about">
      <div className="flex flex-col gap-4">
        <HeaderSection
          title="About"
          titleStyle="text-primaryPink font-averia"
        />
        <div className="text-lg font-libertine">
          <MarkdownRenderer>
            {webData?.DeskripsiHimpunan ?? ""}
          </MarkdownRenderer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-bold text-3xl font-averia text-primaryPink">
          Vision:
        </p>
        <div className="text-xl font-libertine italic border-l-4 border-primaryPink/20 pl-6 py-2">
          <MarkdownRenderer>{cabinetData?.visi ?? ""}</MarkdownRenderer>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p className="font-bold text-3xl font-averia text-primaryPink">
          Mission:
        </p>
        <div className="text-lg font-libertine prose-li:my-2">
          <MarkdownRenderer>{cabinetData?.misi ?? ""}</MarkdownRenderer>
        </div>
      </div>
    </section>
  );
}

export default About;
