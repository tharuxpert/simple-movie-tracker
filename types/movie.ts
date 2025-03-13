export type MovieType = "movie" | "series";

export type SortOption = "dateAdded" | "title";

export type FilterOption =
  | "all"
  | "movies"
  | "series"
  | "watched"
  | "completed";

export interface Movie {
  id: string;
  tempId?: string; // Temporary ID used during sync
  title: string;
  type: MovieType;
  episodesWatched: number;
  dateAdded: string;
  isFavorite?: boolean;
  totalEpisodes?: number;
  currentSeason?: number;
  watched: boolean;
}

export type ViewMode = "list" | "grid";
