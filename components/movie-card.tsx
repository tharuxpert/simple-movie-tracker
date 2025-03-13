import * as React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { useTheme } from "../lib/theme";
import { Feather } from "@expo/vector-icons";

interface MovieCardProps {
  id: string;
  title: string;
  type: "movie" | "series";
  episodesWatched: number;
  totalEpisodes?: number;
  currentSeason?: number;
  dateAdded: string;
  isFavorite?: boolean;
  watched?: boolean;
  viewMode: "list" | "grid";
  onEdit: () => void;
  onDelete: () => void;
  onIncrementEpisode: () => void;
  onDecrementEpisode: () => void;
}

const { width } = Dimensions.get("window");
const GRID_SPACING = 8;
const GRID_ITEM_WIDTH = (width - 32 - GRID_SPACING) / 2;

export function MovieCard({
  id,
  title,
  type,
  episodesWatched,
  totalEpisodes,
  currentSeason,
  dateAdded,
  isFavorite,
  watched,
  viewMode,
  onEdit,
  onDelete,
  onIncrementEpisode,
  onDecrementEpisode,
}: MovieCardProps) {
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      ...(viewMode === "grid"
        ? {
            width: GRID_ITEM_WIDTH,
            margin: GRID_SPACING / 2,
          }
        : {
            marginBottom: 12,
          }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: viewMode === "grid" ? 16 : 18,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 8,
    },
    iconButton: {
      padding: 8,
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    editButton: {
      backgroundColor: colors.primary + "20",
    },
    deleteButton: {
      backgroundColor: colors.accent + "20",
    },
    content: {
      gap: 8,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    infoText: {
      color: colors.muted,
      fontSize: 14,
    },
    episodeControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 8,
    },
    episodeInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    episodeCount: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginHorizontal: 12,
    },
    progressText: {
      color: colors.muted,
      fontSize: 14,
    },
    progressBarContainer: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: 2,
      marginTop: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    progressPercentage: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 4,
      textAlign: "right",
    },
    incrementButton: {
      backgroundColor: "#00800020",
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#00800040",
    },
    decrementButton: {
      backgroundColor: colors.accent + "20",
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ff000040",
    },
    // Delete Modal styles
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background + "CC",
    },
    modalContent: {
      backgroundColor: colors.card,
      width: "85%",
      borderRadius: 20,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    modalText: {
      fontSize: 16,
      color: colors.muted,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: colors.card,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    deleteModalButton: {
      flex: 1,
      backgroundColor: colors.accent,
      paddingVertical: 12,
      borderRadius: 12,
    },
    cancelButtonText: {
      color: colors.text,
      textAlign: "center",
      fontWeight: "600",
      fontSize: 16,
    },
    deleteButtonText: {
      color: "#fff",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 16,
    },
    warningIcon: {
      alignSelf: "center",
      marginBottom: 16,
    },
    watchedBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
      marginTop: 4,
      gap: 4,
      borderWidth: 1,
    },
    watchedBadgeActive: {
      backgroundColor: "#00800020",
      borderColor: "#008000",
    },
    watchedBadgeInactive: {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    watchedText: {
      fontSize: 12,
      fontWeight: "600",
    },
    watchedTextActive: {
      color: "#008000",
    },
    watchedTextInactive: {
      color: colors.muted,
    },
  });

  const isCompleted = totalEpisodes && episodesWatched >= totalEpisodes;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text
            style={styles.title}
            numberOfLines={viewMode === "grid" ? 2 : 1}
          >
            {title}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.iconButton, styles.editButton]}
            >
              <Feather name="edit-2" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDeleteModal(true)}
              style={[styles.iconButton, styles.deleteButton]}
            >
              <Feather name="trash-2" size={16} color={colors.accent} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Feather
              name={type === "series" ? "tv" : "film"}
              size={14}
              color={colors.muted}
            />
            <Text style={styles.infoText}>
              {type === "series" ? "TV Series" : "Movie"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={14} color={colors.muted} />
            <Text style={styles.infoText}>Added: {formatDate(dateAdded)}</Text>
          </View>

          {type === "movie" ? (
            <View
              style={[
                styles.watchedBadge,
                watched
                  ? styles.watchedBadgeActive
                  : styles.watchedBadgeInactive,
              ]}
            >
              <Feather
                name={watched ? "check-circle" : "circle"}
                size={12}
                color={watched ? "#008000" : colors.muted}
              />
              <Text
                style={[
                  styles.watchedText,
                  watched
                    ? styles.watchedTextActive
                    : styles.watchedTextInactive,
                ]}
              >
                {watched ? "Watched" : "Not watched"}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Feather name="play" size={14} color={colors.muted} />
                <Text style={styles.progressText}>
                  Episodes: {episodesWatched}
                  {totalEpisodes ? `/${totalEpisodes}` : ""}
                  {currentSeason && ` • Season ${currentSeason}`}
                </Text>
              </View>
              {totalEpisodes ? (
                <>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${(episodesWatched / totalEpisodes) * 100}%`,
                          backgroundColor: isCompleted
                            ? "#008000"
                            : colors.primary,
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {isCompleted ? (
                      <View
                        style={[styles.watchedBadge, styles.watchedBadgeActive]}
                      >
                        <Feather
                          name="check-circle"
                          size={12}
                          color="#008000"
                        />
                        <Text
                          style={[styles.watchedText, styles.watchedTextActive]}
                        >
                          Completed
                        </Text>
                      </View>
                    ) : (
                      <View style={{ width: 24 }} />
                    )}
                    <Text style={styles.progressPercentage}>
                      {Math.round((episodesWatched / totalEpisodes) * 100)}%
                    </Text>
                  </View>
                </>
              ) : null}
              <View style={styles.episodeControls}>
                <TouchableOpacity
                  onPress={onDecrementEpisode}
                  style={styles.decrementButton}
                  disabled={episodesWatched === 0}
                >
                  <Feather
                    name="arrow-down"
                    size={16}
                    color={episodesWatched === 0 ? colors.muted : "#ff0000"}
                  />
                </TouchableOpacity>
                <Text style={styles.episodeCount}>{episodesWatched}</Text>
                <TouchableOpacity
                  onPress={onIncrementEpisode}
                  style={[
                    styles.incrementButton,
                    isCompleted
                      ? {
                          backgroundColor: colors.border,
                          borderColor: colors.border,
                        }
                      : undefined,
                  ]}
                  disabled={Boolean(isCompleted)}
                >
                  <Feather
                    name="arrow-up"
                    size={16}
                    color={isCompleted ? colors.muted : "#008000"}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Custom Delete Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Feather
              name="alert-triangle"
              size={32}
              color={colors.accent}
              style={styles.warningIcon}
            />
            <Text style={styles.modalTitle}>Delete {type}</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete "{title}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteModalButton}
                onPress={() => {
                  onDelete();
                  setShowDeleteModal(false);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
