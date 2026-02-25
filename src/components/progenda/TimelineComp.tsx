import React from "react";
import { ProgendaType } from "@/types/data/ProgendaType";
import Link from "next/link";
import DesktopComp from "./_timelineComp/DesktopComp";
import MobileComp from "./_timelineComp/MobileComp";
import HeaderSection from "../commons/HeaderSection";

interface TimelineCompProps {
  timeline: ProgendaType["timelines"];
}

export default function TimelineComp({ timeline }: TimelineCompProps) {
  return (
    <div className="flex flex-col items-start mt-4 gap-8">
      <HeaderSection title={"Timeline"} />
      <MobileComp timeline={timeline} />
      <DesktopComp timeline={timeline} />
    </div>
  );
}
