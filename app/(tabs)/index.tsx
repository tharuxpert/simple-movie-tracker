import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Modal,
  Animated,
  Pressable,
  RefreshControl,
} from "react-native";
import { MovieCard } from "../../components/movie-card";
import { useState, useMemo, useRef, useEffect } from "react";
import { useTheme } from "../../lib/theme";
import { Feather } from "@expo/vector-icons";
import { Movie, SortOption, FilterOption, ViewMode } from "../../types/movie";
import { createHomeStyles } from "../../styles/home";
import { AddForm } from "../../components/add-form";
import { EditModal } from "../../components/edit-modal";
import { SortModal } from "../../components/sort-modal";
import { FilterBar } from "../../components/filter-bar";
import { WarningDialog } from "../../components/warning-dialog";
import { Loader } from "../../components/loader";
import { movieService } from "../../lib/movieService";
import React from "react";

export default function HomeScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const styles = createHomeStyles(colors);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"movie" | "series">("movie");
  const [watched, setWatched] = useState(false);
  const [episodesWatched, setEpisodesWatched] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState("");
  const [currentSeason, setCurrentSeason] = useState("");
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<"movie" | "series">("movie");
  const [editWatched, setEditWatched] = useState(false);
  const [editEpisodes, setEditEpisodes] = useState("");
  const [editTotalEpisodes, setEditTotalEpisodes] = useState("");
  const [editCurrentSeason, setEditCurrentSeason] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dateAdded");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const [warningDialog, setWarningDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    type?: "warning" | "error" | "info";
  }>({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const data = await movieService.getMovies();
      setMovies(data);
    } catch (error) {
      showWarning("Error", "Failed to load movies", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await movieService.getMovies();
      setMovies(data);
    } catch (error) {
      showWarning("Error", "Failed to refresh movies", "error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const showWarning = (
    title: string,
    message: string,
    type: "warning" | "error" | "info" = "warning"
  ) => {
    setWarningDialog({ visible: true, title, message, type });
  };

  const addMovie = async () => {
    if (!title.trim()) {
      showWarning("Error", "Please enter a title", "error");
      return;
    }

    if (type === "series" && !episodesWatched.trim()) {
      showWarning(
        "Error",
        "Please enter the number of episodes watched",
        "error"
      );
      return;
    }

    const newMovie = {
      title: title.trim(),
      type,
      episodesWatched: type === "series" ? parseInt(episodesWatched) || 0 : 0,
      dateAdded: new Date().toISOString(),
      ...(type === "series" && {
        totalEpisodes: parseInt(totalEpisodes) || undefined,
        currentSeason: parseInt(currentSeason) || undefined,
      }),
      ...(type === "movie" && {
        watched,
      }),
    };

    try {
      const addedMovie = await movieService.addMovie(newMovie);
      if (addedMovie) {
        setMovies((prev) => [...prev, addedMovie]);
        setTitle("");
        setWatched(false);
        setEpisodesWatched("");
        setTotalEpisodes("");
        setCurrentSeason("");
      } else {
        showWarning("Error", "Failed to add movie", "error");
      }
    } catch (error) {
      if (error instanceof Error) {
        showWarning("Error", error.message, "error");
      } else {
        showWarning("Error", "Failed to add movie", "error");
      }
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditType(movie.type);
    setEditWatched(movie.watched || false);
    setEditEpisodes(movie.episodesWatched.toString());
    setEditTotalEpisodes(movie.totalEpisodes?.toString() || "");
    setEditCurrentSeason(movie.currentSeason?.toString() || "");
    setIsEditModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const success = await movieService.deleteMovie(id);
    if (success) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } else {
      showWarning("Error", "Failed to delete movie", "error");
    }
  };

  const handleIncrementEpisode = async (id: string) => {
    const updatedMovie = await movieService.incrementEpisode(id);
    if (updatedMovie) {
      setMovies((prev) =>
        prev.map((movie) => (movie.id === id ? updatedMovie : movie))
      );
    }
  };

  const handleDecrementEpisode = async (id: string) => {
    const updatedMovie = await movieService.decrementEpisode(id);
    if (updatedMovie) {
      setMovies((prev) =>
        prev.map((movie) => (movie.id === id ? updatedMovie : movie))
      );
    }
  };

  const saveEdit = async () => {
    if (!editingMovie || !editTitle.trim()) return;

    // Validate total episodes for TV series
    if (editType === "series") {
      const watched = parseInt(editEpisodes) || 0;
      const total = parseInt(editTotalEpisodes) || 0;
      if (total > 0 && total < watched) {
        showWarning(
          "Error",
          "Total episodes cannot be less than watched episodes",
          "error"
        );
        return;
      }
    }

    const updates = {
      title: editTitle.trim(),
      type: editType,
      episodesWatched:
        editType === "movie"
          ? 0
          : parseInt(editEpisodes) || editingMovie.episodesWatched,
      totalEpisodes:
        editType === "series"
          ? parseInt(editTotalEpisodes) || undefined
          : undefined,
      currentSeason:
        editType === "series"
          ? parseInt(editCurrentSeason) || undefined
          : undefined,
      watched: editType === "movie" ? editWatched : undefined,
    };

    const updatedMovie = await movieService.updateMovie(
      editingMovie.id,
      updates
    );
    if (updatedMovie) {
      setMovies((prev) =>
        prev.map((movie) =>
          movie.id === editingMovie.id ? updatedMovie : movie
        )
      );
      setIsEditModalVisible(false);
      setEditingMovie(null);
      setEditTitle("");
      setEditType("movie");
      setEditWatched(false);
      setEditEpisodes("");
      setEditTotalEpisodes("");
      setEditCurrentSeason("");
    } else {
      showWarning("Error", "Failed to update movie", "error");
    }
  };

  const toggleSearch = () => {
    if (showSearch) {
      setSearchQuery("");
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => setShowSearch(false));
    } else {
      setShowSearch(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const filteredAndSortedMovies = useMemo(() => {
    let result = [...movies];

    // Apply search
    if (searchQuery.trim()) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filter
    if (filterBy !== "all") {
      result = result.filter((movie) =>
        filterBy === "movies" ? movie.type === "movie" : movie.type === "series"
      );
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "dateAdded":
        default:
          return b.dateAdded.localeCompare(a.dateAdded);
      }
    });

    return result;
  }, [movies, sortBy, filterBy, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Loader size={64} />
          <Text style={styles.loadingText}>Loading your movies...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showSearch) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchActiveContainer}>
          <View style={styles.searchHeader}>
            <TouchableOpacity onPress={toggleSearch} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies and series..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.backButton}
              >
                <Feather name="x" size={20} color={colors.muted} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
                progressBackgroundColor={colors.card}
              />
            }
          >
            {filteredAndSortedMovies.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather
                  name="search"
                  size={48}
                  color={colors.muted}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>
                  No results found for "{searchQuery}"
                </Text>
              </View>
            ) : (
              <View
                style={[
                  viewMode === "list" ? { padding: 16 } : styles.gridContainer,
                  styles.searchResults,
                ]}
              >
                {filteredAndSortedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    {...movie}
                    viewMode={viewMode}
                    onEdit={() => handleEdit(movie)}
                    onDelete={() => handleDelete(movie.id)}
                    onIncrementEpisode={() => handleIncrementEpisode(movie.id)}
                    onDecrementEpisode={() => handleDecrementEpisode(movie.id)}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.card}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Movie Tracker</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleSearch} style={styles.iconButton}>
              <Feather
                name={showSearch ? "x" : "search"}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setViewMode((prev) => (prev === "list" ? "grid" : "list"))
              }
              style={styles.iconButton}
            >
              <Feather
                name={viewMode === "list" ? "grid" : "list"}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
              <Text style={{ color: colors.primary }}>
                {theme === "light" ? "🌙" : "☀️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AddForm
          title={title}
          setTitle={setTitle}
          type={type}
          setType={setType}
          watched={watched}
          setWatched={setWatched}
          episodesWatched={episodesWatched}
          setEpisodesWatched={setEpisodesWatched}
          totalEpisodes={totalEpisodes}
          setTotalEpisodes={setTotalEpisodes}
          currentSeason={currentSeason}
          setCurrentSeason={setCurrentSeason}
          onAdd={addMovie}
        />

        {movies.length > 0 && (
          <FilterBar
            filterBy={filterBy}
            onFilterChange={setFilterBy}
            onSortPress={() => setShowSortModal(true)}
          />
        )}

        {filteredAndSortedMovies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather
              name={
                filterBy === "movies"
                  ? "film"
                  : filterBy === "series"
                  ? "tv"
                  : "film"
              }
              size={48}
              color={colors.muted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : filterBy === "movies"
                ? "No movies added yet"
                : filterBy === "series"
                ? "No TV series added yet"
                : "Add your first movie or TV series to get started"}
            </Text>
          </View>
        ) : (
          <View
            style={viewMode === "list" ? { padding: 16 } : styles.gridContainer}
          >
            {filteredAndSortedMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                {...movie}
                viewMode={viewMode}
                onEdit={() => handleEdit(movie)}
                onDelete={() => handleDelete(movie.id)}
                onIncrementEpisode={() => handleIncrementEpisode(movie.id)}
                onDecrementEpisode={() => handleDecrementEpisode(movie.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      <EditModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setEditingMovie(null);
          setEditTitle("");
          setEditType("movie");
          setEditWatched(false);
          setEditEpisodes("");
          setEditTotalEpisodes("");
          setEditCurrentSeason("");
        }}
        onSave={saveEdit}
        movie={editingMovie}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editType={editType}
        setEditType={setEditType}
        editWatched={editWatched}
        setEditWatched={setEditWatched}
        editEpisodes={editEpisodes}
        setEditEpisodes={setEditEpisodes}
        editTotalEpisodes={editTotalEpisodes}
        setEditTotalEpisodes={setEditTotalEpisodes}
        editCurrentSeason={editCurrentSeason}
        setEditCurrentSeason={setEditCurrentSeason}
      />

      <WarningDialog
        visible={warningDialog.visible}
        onClose={() =>
          setWarningDialog((prev) => ({ ...prev, visible: false }))
        }
        title={warningDialog.title}
        message={warningDialog.message}
        type={warningDialog.type}
      />
    </SafeAreaView>
  );
}
