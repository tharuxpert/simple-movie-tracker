import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FilterOption } from "../types/movie";
import { useTheme } from "../lib/theme";

interface FilterBarProps {
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  onSortPress: () => void;
}

export function FilterBar({
  filterBy,
  onFilterChange,
  onSortPress,
}: FilterBarProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterBy === "all" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("all")}
      >
        <Text
          style={[
            styles.filterButtonText,
            filterBy === "all" && styles.filterButtonTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterBy === "movies" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("movies")}
      >
        <Text
          style={[
            styles.filterButtonText,
            filterBy === "movies" && styles.filterButtonTextActive,
          ]}
        >
          Movies
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          filterBy === "series" && styles.filterButtonActive,
        ]}
        onPress={() => onFilterChange("series")}
      >
        <Text
          style={[
            styles.filterButtonText,
            filterBy === "series" && styles.filterButtonTextActive,
          ]}
        >
          TV Series
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.sortButton} onPress={onSortPress}>
        <Feather name="arrow-down" size={14} color={colors.muted} />
        <Text style={styles.filterButtonText}>Sort</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      color: colors.muted,
      fontSize: 14,
      fontWeight: "500",
    },
    filterButtonTextActive: {
      color: "#fff",
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
  });
