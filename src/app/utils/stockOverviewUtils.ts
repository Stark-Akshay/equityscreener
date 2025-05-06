import { FilteredNewsItem, FilteredOverview } from "../types/types";

// Utility function to get an empty overview object (useful for newsOnly requests)
export const getEmptyOverview = (): FilteredOverview => ({
  Symbol: "",
  AssetType: "",
  Name: "",
  Description: "",
  Exchange: "",
  Currency: "",
  Country: "",
  Sector: "",
  Industry: "",
  Address: "",
  OfficialSite: "",
});

// Utility function to customize news for a specific stock
export const customizeNewsForStock = (
  news: FilteredNewsItem[],
  stockName: string
): FilteredNewsItem[] => {
  return news.map((item) => ({
    ...item,
    title: item.title.replace("The company", stockName),
    summary: item.summary.replace("The company", stockName),
  }));
};
