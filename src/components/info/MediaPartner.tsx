"use client";

import api from "@/lib/axios";
import { ApiResponse } from "@/types/commons/apiResponse";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import HeaderSection from "../commons/HeaderSection";
import ButtonLink from "../links/ButtonLink";

type ThisLink = {
  ExternalSOPLink: string;
  InternalSOPLink: string;
};

function MediaPartner() {
  const [links, setLinks] = useState<ThisLink | null>(null);
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const json = await api.get<ApiResponse<ThisLink>>("/settings/web");
        setLinks(json.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLinks();
  }, []);
  return (
    <section className="flex flex-col gap-4" id="work">
      <HeaderSection
        title="Media Partner"
        titleStyle="text-primaryPink font-averia"
      />
      <p className="text-lg">
        This SOP outlines the procedures and guidelines for establishing media
        partnerships with HIMASAKTA, aimed at promoting events and enhancing the
        visibility of both parties. Our goal is to create mutually beneficial
        relationships that support HIMASAKTA's mission and values.
      </p>
      <div className="flex items-center gap-4 flex-col lg:flex-row lg:gap-6">
        <ButtonLink
          key={links?.ExternalSOPLink}
          href={links?.ExternalSOPLink ?? "/"}
          variant="outline"
          className="border-black bg-white rounded-full gap-3 flex items-center transition-all duration-200 hover:border-primaryGreen hover:bg-white hover:scale-105"
        >
          <span className="text-black transition-all hover:text-primaryGreen duration-300">
            External SOP of HIMASAKTA
          </span>

          <FaExternalLinkAlt
            className="w-4 h-4 text-black transition-colors duration-200 hover:text-green-500
              "
          />
        </ButtonLink>

        <ButtonLink
          key={links?.InternalSOPLink}
          href={links?.InternalSOPLink ?? "/"}
          variant="outline"
          className="border-black bg-white rounded-full gap-3 flex items-center transition-all duration-200 hover:border-primaryGreen hover:bg-white hover:scale-105"
        >
          <span className="text-black transition-all hover:text-primaryGreen duration-300">
            Internal SOP of HIMASAKTA
          </span>

          <FaExternalLinkAlt
            className="w-4 h-4 text-black transition-colors duration-200 hover:text-green-500
              "
          />
        </ButtonLink>
      </div>
    </section>
  );
}

export default MediaPartner;
