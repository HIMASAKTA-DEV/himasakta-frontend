import type { newsType } from "@/types/_dummy_db/allTypes";
import sortByDate from "./sortByDate";

export default function get12LatestNews(news: newsType[]) {
  const sortedNews = sortByDate(news, "date");
  return sortedNews.slice(0, 12);
}
