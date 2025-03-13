import { StyleSheet } from "react-native";
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
      marginBottom: 16,
      marginHorizontal: 8,
      flex: 1,
    },
    listCard: {
      marginBottom: 16,
    },
    // ... rest of the styles ...
  });
