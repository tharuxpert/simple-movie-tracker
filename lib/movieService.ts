import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../types/movie";

const STORAGE_KEY = "@movie_tracker_movies";

export const movieService = {
  async getMovies(): Promise<Movie[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting movies:", error);
      return [];
    }
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
      const movies = await this.getMovies();
      const newMovie: Movie = {
        ...movie,
        id: Date.now().toString(), // Use timestamp as ID
        dateAdded: new Date().toISOString(),
      };

      movies.unshift(newMovie);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
      return newMovie;
    } catch (error) {
      console.error("Error adding movie:", error);
      return null;
    }
  },

  async updateMovie(
    id: string,
    updates: Partial<Movie>
  ): Promise<Movie | null> {
    try {
      const movies = await this.getMovies();
      const movieIndex = movies.findIndex((m) => m.id === id);

      if (movieIndex === -1) {
        return null;
      }

      const updatedMovie = {
        ...movies[movieIndex],
        ...updates,
      };

      movies[movieIndex] = updatedMovie;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
      return updatedMovie;
    } catch (error) {
      console.error("Error updating movie:", error);
      return null;
    }
  },

  async deleteMovie(id: string): Promise<boolean> {
    try {
      const movies = await this.getMovies();
      const newMovies = movies.filter((m) => m.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMovies));
      return true;
    } catch (error) {
      console.error("Error deleting movie:", error);
      return false;
    }
  },

  async incrementEpisode(id: string): Promise<Movie | null> {
    try {
      const movies = await this.getMovies();
      const movie = movies.find((m) => m.id === id);

      if (!movie || movie.type !== "series") {
        return null;
      }

      const updatedMovie = {
        ...movie,
        episodesWatched: movie.episodesWatched + 1,
        watched: movie.totalEpisodes
          ? movie.episodesWatched + 1 >= movie.totalEpisodes
          : false,
      };

      return await this.updateMovie(id, updatedMovie);
    } catch (error) {
      console.error("Error incrementing episode:", error);
      return null;
    }
  },

  async decrementEpisode(id: string): Promise<Movie | null> {
    try {
      const movies = await this.getMovies();
      const movie = movies.find((m) => m.id === id);

      if (!movie || movie.type !== "series" || movie.episodesWatched <= 0) {
        return null;
      }

      const updatedMovie = {
        ...movie,
        episodesWatched: movie.episodesWatched - 1,
        watched: false,
      };

      return await this.updateMovie(id, updatedMovie);
    } catch (error) {
      console.error("Error decrementing episode:", error);
      return null;
    }
  },
};
