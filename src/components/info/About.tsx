import HeaderSection from "../commons/HeaderSection";

function About() {
  return (
    <section className="flex flex-col gap-4" id="about">
      <HeaderSection title="About" titleStyle="text-primaryPink font-averia" />
      <p className="text-lg">
        In the 2024 leadership period, HIMASAKTA ITS adopted the name AVANTURIER
        as the name of the cabinet. AVANTURIER is derived from Dutch, meaning
        "adventurer." As the 6th cabinet, Avanturier is expected to carry
        forward and continue the leadership legacy of HIMASAKTA. It is also
        hoped that HIMASAKTA ITS will continue to serve the needs of ITS
        Actuarial students.
      </p>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">Vision:</p>
        <p className="text-lg">
          To optimize the function of HIMASAKTA ITS as a home that accommodates
          the needs and potential of its members, while enhancing the presence
          of HIMASAKTA ITS both within and outside the Department of Actuarial
          Science at ITS.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-bold text-xl">Mission:</p>
        <ol className="gap-2 list-decimal list-inside ml-6 text-lg">
          <li>
            To foster a sense of belonging among members towards the
            organization, creating a healthy culture and work environment.
          </li>
          <li>
            To position HIMASAKTA as a facilitator that meets the needs and
            potential of ITS Actuarial students.
          </li>
          <li>
            To enhance the presence of HIMASAKTA through optimized branding,
            collaboration, strong relationships with various stakeholders, and
            the development of an informative and integrated information system.
          </li>
        </ol>
      </div>
    </section>
  );
}

export default About;
