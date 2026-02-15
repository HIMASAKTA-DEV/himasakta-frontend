import React from "react";
import HeaderSection from "../commons/HeaderSection";
import { socmedLinks } from "@/layouts/_footer/socmedLinks";
import Link from "next/link";

function Contact() {
  return (
    <section className="flex flex-col gap-4" id="contact">
      <HeaderSection
        title="Contact Us"
        titleStyle="text-primaryPink font-averia"
      />
      <p className="text-lg">
        If you have any questions or need further discussion, please feel free
        to contact us.
      </p>
      <div className="flex gap-4">
        {socmedLinks.map(({ name, url, icon: Icon }) => (
          <Link
            key={name}
            href={url}
            target="_blank"
            className="
                p-3 rounded-2xl
                bg-black text-white
                hover:bg-neutral-800
                transition
              "
          >
            <Icon className="text-xl" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Contact;
