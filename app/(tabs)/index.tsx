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
  ActivityIndicator,
  FlatList,
  Dimensions,
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
  const [isLoading, setIsLoading] = useState(false);
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
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const fetchedMovies = await movieService.getMovies();
      setMovies(fetchedMovies);
    } catch (error) {
      console.error("Error loading movies:", error);
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

    const episodesCount = parseInt(episodesWatched) || 0;
    const totalEpisodesCount = parseInt(totalEpisodes) || 0;

    const newMovie = {
      title: title.trim(),
      type,
      episodesWatched: episodesCount,
      dateAdded: new Date().toISOString(),
      watched:
        type === "movie"
          ? watched
          : totalEpisodesCount > 0
          ? episodesCount >= totalEpisodesCount
          : false,
      totalEpisodes:
        type === "series" ? totalEpisodesCount || undefined : undefined,
      currentSeason:
        type === "series" ? parseInt(currentSeason) || undefined : undefined,
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

    const episodesCount = parseInt(editEpisodes) || 0;
    const totalEpisodesCount = parseInt(editTotalEpisodes) || 0;

    const updates = {
      title: editTitle.trim(),
      type: editType,
      episodesWatched: editType === "movie" ? 0 : episodesCount,
      totalEpisodes:
        editType === "series" ? totalEpisodesCount || undefined : undefined,
      currentSeason:
        editType === "series"
          ? parseInt(editCurrentSeason) || undefined
          : undefined,
      watched:
        editType === "movie"
          ? editWatched
          : totalEpisodesCount > 0
          ? episodesCount >= totalEpisodesCount
          : false,
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

    // Apply filter
    if (filterBy !== "all") {
      result = result.filter((movie) => {
        switch (filterBy) {
          case "movies":
            return movie.type === "movie";
          case "series":
            return movie.type === "series";
          case "watched":
            return movie.type === "movie" && movie.watched;
          case "completed":
            return (
              movie.type === "series" &&
              movie.totalEpisodes &&
              movie.episodesWatched >= movie.totalEpisodes
            );
          default:
            return true;
        }
      });
    }

    // Apply search
    if (searchQuery) {
      result = result.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "dateAdded":
        default:
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          );
      }
    });

    return result;
  }, [movies, sortBy, filterBy, searchQuery]);

  const handleAddMovie = () => {
    const newMovie: Movie = {
      id: Date.now().toString(), // Temporary ID
      title: "",
      type: "movie",
      episodesWatched: 0,
      totalEpisodes: 0,
      currentSeason: 1,
      watched: false,
      dateAdded: new Date().toISOString(),
    };

    setEditingMovie(newMovie);
    setIsEditModalVisible(true);
  };

  const numColumns = viewMode === "grid" ? 2 : 1;
  const screenWidth = Dimensions.get("window").width;
  const padding = 16;
  const gap = 16;
  const itemWidth = (screenWidth - padding * 2 - gap) / 2;

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
                    style={
                      viewMode === "grid" ? { width: itemWidth } : undefined
                    }
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
      <View style={styles.container}>
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

        <FlatList
          data={filteredAndSortedMovies}
          key={viewMode} // Force re-render when view mode changes
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={viewMode === "grid" ? { gap } : undefined}
          contentContainerStyle={[{ padding }, viewMode === "grid" && { gap }]}
          renderItem={({ item: movie }) => (
            <MovieCard
              key={movie.id}
              {...movie}
              viewMode={viewMode}
              style={viewMode === "grid" ? { width: itemWidth } : undefined}
              onEdit={() => handleEdit(movie)}
              onDelete={() => handleDelete(movie.id)}
              onIncrementEpisode={() => handleIncrementEpisode(movie.id)}
              onDecrementEpisode={() => handleDecrementEpisode(movie.id)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={loadMovies}
              colors={[colors.primary]}
              tintColor={colors.primary}
              progressBackgroundColor={colors.card}
            />
          }
          ListHeaderComponent={
            movies.length > 0 ? (
              <FilterBar
                filterBy={filterBy}
                onFilterChange={setFilterBy}
                onSortPress={() => setShowSortModal(true)}
              />
            ) : null
          }
          ListEmptyComponent={
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
                  ? "No movies found"
                  : filterBy === "series"
                  ? "No TV series found"
                  : filterBy === "watched"
                  ? "No watched movies found"
                  : filterBy === "completed"
                  ? "No completed TV series found"
                  : "Add your first movie or TV series to get started"}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddModal(true)}
        >
          <Feather name="plus" size={24} color={colors.background} />
        </TouchableOpacity>

        <Modal
          visible={showAddModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddModal(false)}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Add New
              </Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
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
              onAdd={async () => {
                await addMovie();
                setShowAddModal(false);
              }}
            />
          </View>
        </Modal>

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
      </View>
    </SafeAreaView>
  );
}
