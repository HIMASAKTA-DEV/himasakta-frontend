import allNews from "@/lib/_dummy_db/_berita/dummyBeritaDataAll.json";
import sortByDate from "./sortByDate";

export default function get12LatestNews(news: typeof allNews) {
  const sortedNews = sortByDate(news, "date");
  return sortedNews.slice(0, 12);
}
