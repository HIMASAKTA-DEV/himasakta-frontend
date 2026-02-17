import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { DepartmentList } from "@/components/landing/DepartmentList";
import { EventList } from "@/components/landing/EventList";
import { Hero } from "@/components/landing/Hero";
import { NewsSlider } from "@/components/landing/NewsSlider";
import { Profile } from "@/components/landing/Profile";
import { Quote } from "@/components/landing/Quote";
import { Suspense } from "react";

import {
  getCabinetInfo,
  getDepartments,
  getLatestNews,
  getMonthlyEvents,
} from "@/services/api";

// Revalidate data every hour
export const revalidate = 3600;

async function CabinetData() {
  const cabinet = await getCabinetInfo();
  return (
    <>
      <Hero cabinet={cabinet} />
      <Quote />
      <Profile cabinet={cabinet} />
    </>
  );
}

async function OtherData() {
  // Parallel Fetching using allSettled to be resilient
  const results = await Promise.allSettled([
    getMonthlyEvents(),
    getDepartments(),
    getLatestNews(6),
  ]);

  const events = results[0].status === "fulfilled" ? results[0].value : [];
  const departments = results[1].status === "fulfilled" ? results[1].value : [];
  const news = results[2].status === "fulfilled" ? results[2].value : [];

  return (
    <>
      <EventList events={events} />
      <DepartmentList departments={departments} />
      <NewsSlider news={news} />
    </>
  );
}

function SectionSkeleton() {
  return (
    <div className="w-full py-24 bg-slate-50 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="h-8 w-48 bg-slate-200 rounded-full mb-6"></div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-[88px] md:pt-0">
        <Suspense
          fallback={
            <div className="h-screen bg-slate-900 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <CabinetData />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <OtherData />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
