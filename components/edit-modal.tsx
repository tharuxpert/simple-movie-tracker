import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Movie } from "../types/movie";
import { useTheme } from "../lib/theme";

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  movie: Movie | null;
  editTitle: string;
  setEditTitle: (value: string) => void;
  editType: "movie" | "series";
  setEditType: (value: "movie" | "series") => void;
  editWatched: boolean;
  setEditWatched: (value: boolean) => void;
  editEpisodes: string;
  setEditEpisodes: (value: string) => void;
  editTotalEpisodes: string;
  setEditTotalEpisodes: (value: string) => void;
  editCurrentSeason: string;
  setEditCurrentSeason: (value: string) => void;
}

export function EditModal({
  visible,
  onClose,
  onSave,
  movie,
  editTitle,
  setEditTitle,
  editType,
  setEditType,
  editWatched,
  setEditWatched,
  editEpisodes,
  setEditEpisodes,
  editTotalEpisodes,
  setEditTotalEpisodes,
  editCurrentSeason,
  setEditCurrentSeason,
}: EditModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Edit {editType === "series" ? "Series" : "Movie"}
          </Text>

          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={editTitle}
            onChangeText={setEditTitle}
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.inputLabel}>Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => {
                setEditType("movie");
                setEditEpisodes("");
                setEditTotalEpisodes("");
                setEditCurrentSeason("");
              }}
              style={[
                styles.toggleButton,
                editType === "movie" && styles.toggleButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  editType === "movie" && styles.toggleButtonTextActive,
                ]}
              >
                Movie
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setEditType("series")}
              style={[
                styles.toggleButton,
                editType === "series" && styles.toggleButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  editType === "series" && styles.toggleButtonTextActive,
                ]}
              >
                TV Series
              </Text>
            </TouchableOpacity>
          </View>

          {editType === "movie" ? (
            <>
              <Text style={styles.inputLabel}>Status</Text>
              <TouchableOpacity
                onPress={() => setEditWatched(!editWatched)}
                style={[
                  styles.watchedButton,
                  editWatched && styles.watchedButtonActive,
                ]}
              >
                <Feather
                  name={editWatched ? "check-square" : "square"}
                  size={20}
                  color={editWatched ? colors.primary : colors.muted}
                />
                <Text
                  style={[
                    styles.watchedButtonText,
                    editWatched && styles.watchedButtonTextActive,
                  ]}
                >
                  Watched
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Episodes Watched</Text>
              <TextInput
                style={styles.input}
                placeholder="Episodes watched"
                value={editEpisodes}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) {
                    setEditEpisodes(text);
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Total Episodes</Text>
              <TextInput
                style={styles.input}
                placeholder="Total episodes (optional)"
                value={editTotalEpisodes}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) {
                    setEditTotalEpisodes(text);
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.inputLabel}>Current Season</Text>
              <TextInput
                style={styles.input}
                placeholder="Current season (optional)"
                value={editCurrentSeason}
                onChangeText={(text) => {
                  if (/^\d*$/.test(text)) {
                    setEditCurrentSeason(text);
                  }
                }}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background + "CC",
    },
    modalContent: {
      backgroundColor: colors.card,
      width: "90%",
      minWidth: 280,
      maxWidth: 400,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
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
    modalButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
    },
    cancelButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: colors.text,
      fontWeight: "600",
    },
    saveButtonText: {
      color: "#fff",
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
