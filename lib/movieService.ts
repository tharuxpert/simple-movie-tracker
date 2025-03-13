import { supabase } from "./supabase";
import { Movie } from "../types/movie";

export const movieService = {
  async getMovies(): Promise<Movie[]> {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("dateAdded", { ascending: false });

    if (error) {
      console.error("Error fetching movies:", error);
      return [];
    }

    return data || [];
  },

  async addMovie(movie: Omit<Movie, "id">): Promise<Movie | null> {
    const { data, error } = await supabase
      .from("movies")
      .insert([movie])
      .select()
      .single();

    if (error) {
      console.error("Error adding movie:", error);
      return null;
    }

    return data;
  },

  async updateMovie(
    id: string,
    updates: Partial<Movie>
  ): Promise<Movie | null> {
    const { data, error } = await supabase
      .from("movies")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating movie:", error);
      return null;
    }

    return data;
  },

  async deleteMovie(id: string): Promise<boolean> {
    const { error } = await supabase.from("movies").delete().eq("id", id);

    if (error) {
      console.error("Error deleting movie:", error);
      return false;
    }

    return true;
  },

  async incrementEpisode(id: string): Promise<Movie | null> {
    const { data: movie } = await supabase
      .from("movies")
      .select("episodesWatched")
      .eq("id", id)
      .single();

    if (!movie) return null;

    return this.updateMovie(id, {
      episodesWatched: movie.episodesWatched + 1,
    });
  },

  async decrementEpisode(id: string): Promise<Movie | null> {
    const { data: movie } = await supabase
      .from("movies")
      .select("episodesWatched")
      .eq("id", id)
      .single();

    if (!movie || movie.episodesWatched <= 0) return null;

    return this.updateMovie(id, {
      episodesWatched: movie.episodesWatched - 1,
    });
  },
};
