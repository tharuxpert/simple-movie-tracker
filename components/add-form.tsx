import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../lib/theme";

interface AddFormProps {
  title: string;
  setTitle: (value: string) => void;
  type: "movie" | "series";
  setType: (value: "movie" | "series") => void;
  watched: boolean;
  setWatched: (value: boolean) => void;
  episodesWatched: string;
  setEpisodesWatched: (value: string) => void;
  totalEpisodes: string;
  setTotalEpisodes: (value: string) => void;
  currentSeason: string;
  setCurrentSeason: (value: string) => void;
  onAdd: () => void;
}

export function AddForm({
  title,
  setTitle,
  type,
  setType,
  watched,
  setWatched,
  episodesWatched,
  setEpisodesWatched,
  totalEpisodes,
  setTotalEpisodes,
  currentSeason,
  setCurrentSeason,
  onAdd,
}: AddFormProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.addForm}>
      <TextInput
        style={styles.input}
        placeholder="Enter title..."
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.muted}
      />

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => {
            setType("movie");
            setEpisodesWatched("");
          }}
          style={[
            styles.toggleButton,
            type === "movie" && styles.toggleButtonActive,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              type === "movie" && styles.toggleButtonTextActive,
            ]}
          >
            Movie
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("series")}
          style={[
            styles.toggleButton,
            type === "series" && styles.toggleButtonActive,
          ]}
        >
          <Text
            style={[
              styles.toggleButtonText,
              type === "series" && styles.toggleButtonTextActive,
            ]}
          >
            TV Series
          </Text>
        </TouchableOpacity>
      </View>

      {type === "movie" ? (
        <TouchableOpacity
          onPress={() => setWatched(!watched)}
          style={[styles.watchedButton, watched && styles.watchedButtonActive]}
        >
          <Feather
            name={watched ? "check-square" : "square"}
            size={20}
            color={watched ? colors.primary : colors.muted}
          />
          <Text
            style={[
              styles.watchedButtonText,
              watched && styles.watchedButtonTextActive,
            ]}
          >
            Watched
          </Text>
        </TouchableOpacity>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Number of episodes watched"
            value={episodesWatched}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setEpisodesWatched(text);
              }
            }}
            keyboardType="numeric"
            placeholderTextColor={colors.muted}
          />
          <TextInput
            style={styles.input}
            placeholder="Total episodes (optional)"
            value={totalEpisodes}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setTotalEpisodes(text);
              }
            }}
            keyboardType="numeric"
            placeholderTextColor={colors.muted}
          />
          <TextInput
            style={styles.input}
            placeholder="Current season (optional)"
            value={currentSeason}
            onChangeText={(text) => {
              if (/^\d*$/.test(text)) {
                setCurrentSeason(text);
              }
            }}
            keyboardType="numeric"
            placeholderTextColor={colors.muted}
          />
        </>
      )}

      <TouchableOpacity
        onPress={onAdd}
        style={styles.addButton}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>
          Add {type === "series" ? "Series" : "Movie"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    addForm: {
      backgroundColor: colors.card,
      padding: 16,
      marginHorizontal: 16,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      fontSize: 16,
      backgroundColor: colors.background,
      color: colors.text,
    },
    toggleContainer: {
      flexDirection: "row",
      marginBottom: 12,
    },
    toggleButton: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginHorizontal: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    toggleButtonActive: {
      backgroundColor: colors.primary,
    },
    toggleButtonText: {
      color: colors.muted,
      textAlign: "center",
      fontWeight: "600",
    },
    toggleButtonTextActive: {
      color: "#fff",
    },
    addButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 12,
      borderRadius: 12,
    },
    addButtonText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "600",
    },
    watchedButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      gap: 8,
    },
    watchedButtonActive: {
      backgroundColor: colors.primary + "20",
      borderColor: colors.primary,
    },
    watchedButtonText: {
      color: colors.muted,
      fontSize: 16,
      fontWeight: "500",
    },
    watchedButtonTextActive: {
      color: colors.primary,
      fontWeight: "600",
    },
  });
