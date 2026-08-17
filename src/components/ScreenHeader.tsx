import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../theme";

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
};

export function ScreenHeader({
  title,
  showBack = true,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.backPlaceholder} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 36,
    lineHeight: 40,
    color: theme.colors.primary,
  },

  backPlaceholder: {
    width: 40,
  },

  rightPlaceholder: {
    width: 40,
  },

  title: {
    fontSize: theme.typography.header.fontSize,
    fontWeight: theme.typography.header.fontWeight,
    color: theme.colors.textPrimary,
  },
});
