import { supabase } from "./supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/movie";

const STORAGE_KEY = "@movie_tracker_movies";

export const movieService = {
  // Local storage operations
  async getLocalMovies(): Promise<Movie[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting local movies:", error);
      return [];
    }
  },

  async setLocalMovies(movies: Movie[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
    } catch (error) {
      console.error("Error setting local movies:", error);
    }
  },

  // Sync with Supabase
  async syncWithSupabase(): Promise<void> {
    try {
      // Fetch latest data from Supabase
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("date_added", { ascending: false });

      if (error) {
        console.error("Error syncing with Supabase:", error);
        return;
      }

      // Transform and store in local storage
      const movies = (data || []).map((movie) => ({
        ...movie,
        episodesWatched: movie.episodes_watched,
        totalEpisodes: movie.total_episodes,
        currentSeason: movie.current_season,
        dateAdded: movie.date_added,
      }));

      await this.setLocalMovies(movies);
    } catch (error) {
      console.error("Error in sync process:", error);
    }
  },

  // Public API
  async getMovies(): Promise<Movie[]> {
    // First try to get from local storage
    const localMovies = await this.getLocalMovies();

    // Then try to sync with Supabase in the background
    this.syncWithSupabase().catch(console.error);

    return localMovies;
  },

  async addMovie(movie: Omit<Movie, "id">): Promise<Movie | null> {
    if (
      movie.type === "series" &&
      movie.totalEpisodes &&
      movie.totalEpisodes < movie.episodesWatched
    ) {
      throw new Error("Total episodes cannot be less than watched episodes");
    }

    try {
      // Add to Supabase first
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
        console.error("Error adding movie to Supabase:", error);
        return null;
      }

      // Transform the response
      const newMovie = {
        ...data,
        episodesWatched: data.episodes_watched,
        totalEpisodes: data.total_episodes,
        currentSeason: data.current_season,
        dateAdded: data.date_added,
      };

      // Update local storage
      const localMovies = await this.getLocalMovies();
      localMovies.unshift(newMovie);
      await this.setLocalMovies(localMovies);

      return newMovie;
    } catch (error) {
      console.error("Error in addMovie process:", error);
      return null;
    }
  },

  async updateMovie(
    id: string,
    updates: Partial<Movie>
  ): Promise<Movie | null> {
    try {
      // Update in Supabase first
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
        console.error("Error updating movie in Supabase:", error);
        return null;
      }

      // Transform the response
      const updatedMovie = {
        ...data,
        episodesWatched: data.episodes_watched,
        totalEpisodes: data.total_episodes,
        currentSeason: data.current_season,
        dateAdded: data.date_added,
      };

      // Update local storage
      const localMovies = await this.getLocalMovies();
      const movieIndex = localMovies.findIndex((m) => m.id === id);
      if (movieIndex !== -1) {
        localMovies[movieIndex] = updatedMovie;
        await this.setLocalMovies(localMovies);
      }

      return updatedMovie;
    } catch (error) {
      console.error("Error in updateMovie process:", error);
      return null;
    }
  },

  async deleteMovie(id: string): Promise<boolean> {
    try {
      // Delete from Supabase first
      const { error } = await supabase.from("movies").delete().eq("id", id);
      if (error) {
        console.error("Error deleting movie from Supabase:", error);
        return false;
      }

      // Update local storage
      const localMovies = await this.getLocalMovies();
      const newMovies = localMovies.filter((m) => m.id !== id);
      await this.setLocalMovies(newMovies);

      return true;
    } catch (error) {
      console.error("Error in deleteMovie process:", error);
      return false;
    }
  },

  async incrementEpisode(id: string): Promise<Movie | null> {
    try {
      // First get the current movie
      const { data: currentMovie, error: fetchError } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !currentMovie || currentMovie.type !== "series") {
        console.error("Error fetching movie or invalid type:", fetchError);
        return null;
      }

      // Update in Supabase
      const { data, error } = await supabase
        .from("movies")
        .update({
          episodes_watched: currentMovie.episodes_watched + 1,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error incrementing episode in Supabase:", error);
        return null;
      }

      // Transform the response
      const updatedMovie = {
        ...data,
        episodesWatched: data.episodes_watched,
        totalEpisodes: data.total_episodes,
        currentSeason: data.current_season,
        dateAdded: data.date_added,
      };

      // Update local storage
      const localMovies = await this.getLocalMovies();
      const movieIndex = localMovies.findIndex((m) => m.id === id);
      if (movieIndex !== -1) {
        localMovies[movieIndex] = updatedMovie;
        await this.setLocalMovies(localMovies);
      }

      return updatedMovie;
    } catch (error) {
      console.error("Error in incrementEpisode process:", error);
      return null;
    }
  },

  async decrementEpisode(id: string): Promise<Movie | null> {
    try {
      // First get the current movie
      const { data: currentMovie, error: fetchError } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (
        fetchError ||
        !currentMovie ||
        currentMovie.type !== "series" ||
        currentMovie.episodes_watched <= 0
      ) {
        console.error(
          "Error fetching movie, invalid type, or no episodes to decrement:",
          fetchError
        );
        return null;
      }

      // Update in Supabase
      const { data, error } = await supabase
        .from("movies")
        .update({
          episodes_watched: currentMovie.episodes_watched - 1,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error decrementing episode in Supabase:", error);
        return null;
      }

      // Transform the response
      const updatedMovie = {
        ...data,
        episodesWatched: data.episodes_watched,
        totalEpisodes: data.total_episodes,
        currentSeason: data.current_season,
        dateAdded: data.date_added,
      };

      // Update local storage
      const localMovies = await this.getLocalMovies();
      const movieIndex = localMovies.findIndex((m) => m.id === id);
      if (movieIndex !== -1) {
        localMovies[movieIndex] = updatedMovie;
        await this.setLocalMovies(localMovies);
      }

      return updatedMovie;
    } catch (error) {
      console.error("Error in decrementEpisode process:", error);
      return null;
    }
  },
};
