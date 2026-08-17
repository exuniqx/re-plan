import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ChooseScreen() {
  const params =
    useLocalSearchParams<{
      projectId?: string;
      projectName?: string;
    }>();

  const projectName =
    params.projectName || "プロジェクト";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        CHOOSE
      </Text>

      <View style={styles.projectCard}>
        <Text style={styles.projectLabel}>
          PROJECT
        </Text>

        <Text style={styles.projectName}>
          {projectName}
        </Text>
      </View>

      <Text style={styles.description}>
        何をしますか？
      </Text>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/plan",
              params: {
                projectId:
                  params.projectId,
                projectName,
              },
            })
          }
        >
          <Text style={styles.buttonTitle}>
            予定を立てる
          </Text>

          <Text style={styles.buttonDescription}>
            行きたい場所や予定を登録する
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/realplan",
              params: {
                projectId:
                  params.projectId,
                projectName,
              },
            })
          }
        >
          <Text style={styles.buttonTitle}>
            評価する
          </Text>

          <Text style={styles.buttonDescription}>
            実際の体験を振り返る
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/score",
              params: {
                projectId:
                  params.projectId,
                projectName,
              },
            })
          }
        >
          <Text style={styles.buttonTitle}>
            点数をつける
          </Text>

          <Text style={styles.buttonDescription}>
            体験を総合的に評価する
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    letterSpacing: 0.5,
    marginBottom: 20,
  },

  projectCard: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  projectLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#647289",
    letterSpacing: 1,
    marginBottom: 6,
  },

  projectName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
  },

  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 28,
    marginBottom: 14,
  },

  buttons: {
    gap: 12,
  },

  button: {
    minHeight: 76,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  buttonPressed: {
    backgroundColor: "#B2BDE5",
    borderColor: "#176584",
  },

  buttonTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#176584",
    marginBottom: 4,
  },

  buttonDescription: {
    fontSize: 13,
    color: "#647289",
  },
});