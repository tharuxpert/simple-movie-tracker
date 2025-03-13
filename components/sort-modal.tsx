import React from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet } from "react-native";
import { SortOption } from "../types/movie";
import { useTheme } from "../lib/theme";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSort: (option: SortOption) => void;
}

export function SortModal({
  visible,
  onClose,
  sortBy,
  onSort,
}: SortModalProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sort by</Text>
          <TouchableOpacity
            style={[
              styles.sortModalOption,
              sortBy === "dateAdded" && styles.sortModalOptionActive,
            ]}
            onPress={() => {
              onSort("dateAdded");
              onClose();
            }}
          >
            <Text
              style={[
                styles.sortModalOptionText,
                sortBy === "dateAdded" && styles.sortModalOptionTextActive,
              ]}
            >
              Date Added
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortModalOption,
              sortBy === "title" && styles.sortModalOptionActive,
            ]}
            onPress={() => {
              onSort("title");
              onClose();
            }}
          >
            <Text
              style={[
                styles.sortModalOptionText,
                sortBy === "title" && styles.sortModalOptionTextActive,
              ]}
            >
              Title
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background + "CC",
      width: "100%",
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
    sortModalOption: {
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    sortModalOptionText: {
      color: colors.text,
      fontSize: 16,
    },
    sortModalOptionActive: {
      backgroundColor: colors.primary + "10",
    },
    sortModalOptionTextActive: {
      color: colors.primary,
      fontWeight: "600",
    },
  });
