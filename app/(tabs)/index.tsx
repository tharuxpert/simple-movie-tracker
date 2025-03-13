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
  Alert,
  Animated,
  Pressable,
} from "react-native";
import { MovieCard } from "../../components/movie-card";
import { useState, useMemo, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../lib/theme";
import { Feather } from "@expo/vector-icons";
import { Movie, SortOption, FilterOption, ViewMode } from "../../types/movie";
import { createHomeStyles } from "../../styles/home";
import { AddForm } from "../../components/add-form";
import { EditModal } from "../../components/edit-modal";
import { SortModal } from "../../components/sort-modal";
import { FilterBar } from "../../components/filter-bar";

export default function HomeScreen() {
  const { colors, toggleTheme, theme } = useTheme();
  const styles = createHomeStyles(colors);
  const [movies, setMovies] = useState<Movie[]>([]);
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

  const addMovie = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (type === "series" && !episodesWatched.trim()) {
      Alert.alert("Error", "Please enter the number of episodes watched");
      return;
    }

    const newMovie: Movie = {
      id: Date.now().toString(),
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

    const updatedMovies = [...movies, newMovie];
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
    setTitle("");
    setWatched(false);
    setEpisodesWatched("");
    setTotalEpisodes("");
    setCurrentSeason("");
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

  const handleDelete = (id: string) => {
    const updatedMovies = movies.filter((movie) => movie.id !== id);
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
  };

  const handleIncrementEpisode = (id: string) => {
    const updatedMovies = movies.map((movie) =>
      movie.id === id
        ? {
            ...movie,
            episodesWatched: movie.episodesWatched + 1,
          }
        : movie
    );
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
  };

  const handleDecrementEpisode = (id: string) => {
    const updatedMovies = movies.map((movie) =>
      movie.id === id && movie.episodesWatched > 0
        ? {
            ...movie,
            episodesWatched: movie.episodesWatched - 1,
          }
        : movie
    );
    setMovies(updatedMovies);
    saveMovies(updatedMovies);
  };

  const saveEdit = () => {
    if (!editingMovie || !editTitle.trim()) return;

    const updatedMovies = movies.map((movie) =>
      movie.id === editingMovie.id
        ? {
            ...movie,
            title: editTitle.trim(),
            type: editType,
            episodesWatched:
              editType === "movie"
                ? 0
                : parseInt(editEpisodes) || movie.episodesWatched,
            totalEpisodes:
              editType === "series"
                ? parseInt(editTotalEpisodes) || undefined
                : undefined,
            currentSeason:
              editType === "series"
                ? parseInt(editCurrentSeason) || undefined
                : undefined,
            watched: editType === "movie" ? editWatched : undefined,
          }
        : movie
    );

    setMovies(updatedMovies);
    saveMovies(updatedMovies);
    setIsEditModalVisible(false);
    setEditingMovie(null);
    setEditTitle("");
    setEditType("movie");
    setEditWatched(false);
    setEditEpisodes("");
    setEditTotalEpisodes("");
    setEditCurrentSeason("");
  };

  const saveMovies = async (updatedMovies: Movie[]) => {
    try {
      await AsyncStorage.setItem("movies", JSON.stringify(updatedMovies));
    } catch (error) {
      console.error("Error saving movies:", error);
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

          <ScrollView style={styles.container}>
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
      <ScrollView style={styles.container}>
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
    </SafeAreaView>
  );
}
