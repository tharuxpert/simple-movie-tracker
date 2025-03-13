export interface Movie {
  id: string;
  title: string;
  type: "movie" | "series";
  episodesWatched: number;
  dateAdded: string;
  isFavorite?: boolean;
  totalEpisodes?: number;
  currentSeason?: number;
  watched?: boolean;
}

export type SortOption = "dateAdded" | "title";
export type FilterOption = "all" | "movies" | "series";
export type ViewMode = "list" | "grid";
