import { supabase } from "./supabase";
import { Movie } from "../types/movie";

export const movieService = {
  async getMovies(): Promise<Movie[]> {
    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .order("date_added", { ascending: false });

    if (error) {
      console.error("Error fetching movies:", error);
      return [];
    }

    // Transform snake_case to camelCase for the frontend
    return (data || []).map((movie) => ({
      ...movie,
      episodesWatched: movie.episodes_watched,
      totalEpisodes: movie.total_episodes,
      currentSeason: movie.current_season,
      dateAdded: movie.date_added,
    }));
  },

  async addMovie(movie: Omit<Movie, "id">): Promise<Movie | null> {
    // Validate total episodes for TV series
    if (
      movie.type === "series" &&
      movie.totalEpisodes &&
      movie.totalEpisodes < movie.episodesWatched
    ) {
      throw new Error("Total episodes cannot be less than watched episodes");
    }

    // Transform camelCase to snake_case for the database
    const dbMovie = {
      title: movie.title,
      type: movie.type,
      episodes_watched: movie.episodesWatched,
      total_episodes: movie.totalEpisodes,
      current_season: movie.currentSeason,
      watched: movie.watched,
      date_added: movie.dateAdded,
    };

    const { data, error } = await supabase
      .from("movies")
      .insert([dbMovie])
      .select()
      .single();

    if (error) {
      console.error("Error adding movie:", error);
      return null;
    }

    // Transform snake_case to camelCase for the frontend
    return {
      ...data,
      episodesWatched: data.episodes_watched,
      totalEpisodes: data.total_episodes,
      currentSeason: data.current_season,
      dateAdded: data.date_added,
    };
  },

  async updateMovie(
    id: string,
    updates: Partial<Movie>
  ): Promise<Movie | null> {
    // Transform camelCase to snake_case for the database
    const dbUpdates = {
      title: updates.title,
      type: updates.type,
      episodes_watched: updates.episodesWatched,
      total_episodes: updates.totalEpisodes,
      current_season: updates.currentSeason,
      watched: updates.watched,
      date_added: updates.dateAdded,
    };

    const { data, error } = await supabase
      .from("movies")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating movie:", error);
      return null;
    }

    // Transform snake_case to camelCase for the frontend
    return {
      ...data,
      episodesWatched: data.episodes_watched,
      totalEpisodes: data.total_episodes,
      currentSeason: data.current_season,
      dateAdded: data.date_added,
    };
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
    const { error } = await supabase.rpc("increment_episodes", {
      movie_id: id,
    });

    if (error) {
      console.error("Error incrementing episode:", error);
      return null;
    }

    // Fetch the updated movie
    const { data, error: fetchError } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated movie:", fetchError);
      return null;
    }

    // Transform snake_case to camelCase for the frontend
    return {
      ...data,
      episodesWatched: data.episodes_watched,
      totalEpisodes: data.total_episodes,
      currentSeason: data.current_season,
      dateAdded: data.date_added,
    };
  },

  async decrementEpisode(id: string): Promise<Movie | null> {
    const { error } = await supabase.rpc("decrement_episodes", {
      movie_id: id,
    });

    if (error) {
      console.error("Error decrementing episode:", error);
      return null;
    }

    // Fetch the updated movie
    const { data, error: fetchError } = await supabase
      .from("movies")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching updated movie:", fetchError);
      return null;
    }

    // Transform snake_case to camelCase for the frontend
    return {
      ...data,
      episodesWatched: data.episodes_watched,
      totalEpisodes: data.total_episodes,
      currentSeason: data.current_season,
      dateAdded: data.date_added,
    };
  },
};
