import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>ちりつも</Text>

      <Text style={styles.title}>
        ワクワク TEST
      </Text>

      <Text style={styles.subtitle}>
        期待と現実のギャップを、次の体験へ。
      </Text>

      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("PROJECT BUTTON PRESSED");
            router.push("/project");
          }}
        >
          <Text style={styles.buttonText}>
            プロジェクトを見る
          </Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => {
            console.log("CHECK BUTTON PRESSED");
            router.push("/check");
          }}
        >
          <Text style={styles.buttonText}>
            気を付ける
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 16,
    backgroundColor: "#ffffff",
  },

  appName: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#176584",
    marginBottom: 8,
  },

  title: {
    fontSize: 40,
    fontWeight: "700",
    textAlign: "center",
    color: "#000000",
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
    color: "#333333",
  },

  buttonGroup: {
    gap: 12,
  },

  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176584",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});