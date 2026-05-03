import { ProgendaType } from "@/types/data/ProgendaType";
import HeaderSection from "../commons/HeaderSection";
import DesktopComp from "./_timelineComp/DesktopComp";
import MobileComp from "./_timelineComp/MobileComp";
import FramerMotionWrapper from "../commons/FramerMotionWrapper";

interface TimelineCompProps {
  timeline: ProgendaType["timelines"];
}

export default function TimelineComp({ timeline }: TimelineCompProps) {
  return (
    <FramerMotionWrapper
      className="flex flex-col items-start mt-4 gap-8"
      variant="fadeRight"
    >
      <HeaderSection title={"Timeline"} />
      <MobileComp timeline={timeline} />
      <DesktopComp timeline={timeline} />
    </FramerMotionWrapper>
  );
}
