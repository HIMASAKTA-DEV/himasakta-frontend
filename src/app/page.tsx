import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { Quote } from "@/components/landing/Quote";
import { Profile } from "@/components/landing/Profile";
import { DepartmentList } from "@/components/landing/DepartmentList";
import { EventList } from "@/components/landing/EventList";
import { NewsSlider } from "@/components/landing/NewsSlider";

import {
  getCabinetInfo,
  getDepartments,
  getLatestNews,
  getMonthlyEvents
} from "@/services/api";

// Revalidate data every hour
export const revalidate = 3600;

export default async function Home() {
  // Parallel Data Fetching
  const [cabinet, departments, news, events] = await Promise.all([
    getCabinetInfo(),
    getDepartments(),
    getLatestNews(6),
    getMonthlyEvents()
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero cabinet={cabinet} />
        <Quote />
        <Profile cabinet={cabinet} />
        <EventList events={events} />
        <DepartmentList departments={departments} />
        <NewsSlider news={news} />
      </main>
      <Footer />
    </>
  );
}
