import newsData from "@/data/blockchain-news.json";

export const NEWS_PAGE_SIZE = 9;

export function getNewsItems() {
  return [...newsData.items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNewsTotalPages() {
  return Math.max(1, Math.ceil(getNewsItems().length / NEWS_PAGE_SIZE));
}
