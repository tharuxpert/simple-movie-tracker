import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Modal,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "../lib/theme";
import { Feather } from "@expo/vector-icons";
import { Movie, ViewMode } from "../types/movie";
import { createMovieCardStyles } from "../styles/movie-card";

interface MovieCardProps extends Omit<Movie, "id"> {
  id: string;
  viewMode: ViewMode;
  onEdit: () => void;
  onDelete: () => void;
  onIncrementEpisode: () => void;
  onDecrementEpisode: () => void;
  style?: StyleProp<ViewStyle>;
}

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
  style,
}: MovieCardProps) {
  const { colors } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const styles = createMovieCardStyles(colors);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isCompleted = totalEpisodes && episodesWatched >= totalEpisodes;

  return (
    <>
      <View
        style={[
          styles.card,
          viewMode === "grid" ? styles.gridCard : styles.listCard,
          style,
        ]}
      >
        {viewMode === "list" ? (
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
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
        ) : (
          <>
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle} numberOfLines={2}>
                {title}
              </Text>
              <View style={styles.gridButtonContainer}>
                <TouchableOpacity
                  onPress={onEdit}
                  style={[styles.gridIconButton, styles.editButton]}
                >
                  <Feather name="edit-2" size={14} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(true)}
                  style={[styles.gridIconButton, styles.deleteButton]}
                >
                  <Feather name="trash-2" size={14} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

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
