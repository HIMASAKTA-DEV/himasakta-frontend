import { configuration } from "../../../config";
import HeaderSection from "../commons/HeaderSection";

function About() {
  return (
    <section className="flex flex-col gap-4" id="about">
      <HeaderSection title="About" titleStyle="text-primaryPink font-averia" />
      <p className="text-lg">{configuration.DeskripsiHimpunan}</p>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">Vision:</p>
        <p className="text-lg">{configuration.Visi}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">Mission:</p>
        <ol className="gap-2 list-decimal list-inside ml-6 text-lg">
          {configuration.Misi.map((misi: string, index: number) => (
            <li key={index}>{misi}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default About;
