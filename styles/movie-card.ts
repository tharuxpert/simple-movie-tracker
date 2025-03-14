import { StyleSheet, ViewStyle } from "react-native";
import { Theme } from "../lib/theme";

export const createMovieCardStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    gridCard: {
      flex: 1,
    },
    listCard: {
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    gridHeader: {
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      flex: 1,
    },
    gridTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 12,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    rating: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    date: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    buttonContainer: {
      flexDirection: "row",
      gap: 8,
    },
    gridButtonContainer: {
      flexDirection: "row",
      gap: 8,
      justifyContent: "flex-end",
    },
    iconButton: {
      padding: 8,
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    gridIconButton: {
      padding: 6,
      borderRadius: 16,
      width: 28,
      height: 28,
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
