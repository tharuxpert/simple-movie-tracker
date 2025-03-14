export type ViewMode = "list" | "grid";

export interface Movie {
  id: string;
  title: string;
  type: "movie" | "series";
  description?: string;
  rating?: number;
  dateAdded: string;
  isFavorite?: boolean;
  watched?: boolean;
  episodesWatched?: number;
  totalEpisodes?: number;
  currentSeason?: number;
}
