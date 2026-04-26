"use client";

import NotFound from "@/app/not-found";
import HeaderSection from "@/components/commons/HeaderSection";
import ImageFallback from "@/components/commons/ImageFallback";
import SkeletonHeaderSection from "@/components/commons/skeletons/SkeletonHeaderSection";
import SkeletonParagraph from "@/components/commons/skeletons/SkeletonParagraph";
import SkeletonSection from "@/components/commons/skeletons/SkeletonSection";
import ButtonLink from "@/components/links/ButtonLink";
import GalleryProgenda from "@/components/progenda/GalleryProgenda";
import TimelineComp from "@/components/progenda/TimelineComp";
import Layout from "@/layouts/Layout";
import { GetProgendaById } from "@/services/progenda/GetProgendaById";
import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function ProgendaDetailClient() {
  const params = useParams();
  const { id } = params;
  const [progenda, setProgenda] = useState<ProgendaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [_viewingImg, setViewingImg] = useState(false);
  const fetchProgendaInfo = async (id: string) => {
    setLoading(true);
    setError(false);
    try {
      const json = await GetProgendaById(id);
      setProgenda(json.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inp = Array.isArray(id) ? id[0] : id;
    fetchProgendaInfo(inp);
  }, [id]);

  if (error) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <Layout withFooter withNavbar={false} transparentOnTop={false}>
        <ButtonLink
          href={`/departments/${progenda?.department?.slug}`}
          className="w-28 flex gap-4 items-center m-8"
          variant="black"
        >
          <FaChevronLeft />
          <p>Back</p>
        </ButtonLink>
        <main className="min-h-screen px-10 flex flex-col lg:px-40 gap-6 mb-4">
          <SkeletonHeaderSection />
          <div className="flex w-full items-center justify-center">
            <div className="aspect-video w-[80%]">
              <SkeletonSection />
            </div>
          </div>
          <SkeletonParagraph />
        </main>
      </Layout>
    );
  }

  return (
    <Layout withFooter withNavbar={false} transparentOnTop={false}>
      <ButtonLink
        href={`/departments/${progenda?.department?.slug}`}
        className="w-28 flex gap-4 items-center m-8"
        variant="black"
      >
        <FaChevronLeft />
        <p>Back</p>
      </ButtonLink>

      <main className="min-h-screen px-10 flex flex-col lg:px-40 gap-6 mb-20">
        <HeaderSection
          title={progenda?.name}
          sub={
            progenda?.created_at
              ? new Date(progenda.created_at).toLocaleDateString()
              : ""
          }
          subStyle="font-libertine text-gray-500"
        />
        <div className="relative w-full aspect-[21/9] rounded-lg flex flex-col gap-4">
          <ImageFallback
            src={progenda?.thumbnail?.image_url}
            isFill
            imgStyle="object-cover rounded-lg"
          />
          <div className="font-libertine text-md">
            <ReactMarkdown>{progenda?.description}</ReactMarkdown>
          </div>
        </div>
        <div className="flex w-full gap-4 justify-center">
          {progenda?.instagram_link && (
            <Link
              href={progenda.instagram_link}
              target="_blank"
              className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-80 transition-all duration-300"
            >
              <FaInstagram className="text-xl" />
            </Link>
          )}
          {progenda?.website_link && (
            <Link
              href={progenda.website_link}
              target="_blank"
              className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-80 transition-all duration-300"
            >
              <FaGlobe className="text-xl" />
            </Link>
          )}
          {progenda?.twitter_link && (
            <Link
              href={progenda.twitter_link}
              target="_blank"
              className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-80 transition-all duration-300"
            >
              <FaTwitter className="text-xl" />
            </Link>
          )}
          {progenda?.linkedin_link && (
            <Link
              href={progenda.linkedin_link}
              target="_blank"
              className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-80 transition-all duration-300"
            >
              <FaLinkedin className="text-xl" />
            </Link>
          )}
          {progenda?.youtube_link && (
            <Link
              href={progenda.youtube_link}
              target="_blank"
              className="p-3 rounded-2xl bg-primaryPink text-white hover:opacity-80 transition-all duration-300"
            >
              <FaYoutube className="text-xl" />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <HeaderSection title={"Tujuan"} />
          <div className="font-libertine text-md">
            <ReactMarkdown>{progenda?.goal}</ReactMarkdown>
          </div>
        </div>

        <GalleryProgenda {...progenda} viewingImg={setViewingImg} />
        <div className="w-full flex flex-col gap-4">
          <TimelineComp timeline={progenda?.timelines} />
        </div>
      </main>
    </Layout>
  );
}
