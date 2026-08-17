import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePlans } from "../PlanContext";

export default function CheckScreen() {
  const {
    evaluationItems,
    toggleEvaluationItem,
  } = usePlans();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHECK</Text>

      <Text style={styles.description}>
        今後の評価項目として登録するものを選択してください
      </Text>

      <View style={styles.list}>
        {evaluationItems.map((item) => {
          const isRegistered = item.registered;

          return (
            <View key={item.id} style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.name}
                </Text>

                <Text style={styles.status}>
                  {isRegistered ? "登録済み" : "未登録"}
                </Text>
              </View>

              <Pressable
                style={[
                  styles.actionButton,
                  isRegistered && styles.registeredButton,
                ]}
                onPress={() =>
                  toggleEvaluationItem(item.id)
                }
              >
                <Text
                  style={[
                    styles.actionButtonText,
                    isRegistered &&
                      styles.registeredButtonText,
                  ]}
                >
                  {isRegistered ? "−" : "＋"}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333333",
    marginBottom: 24,
  },

  list: {
    gap: 12,
  },

  item: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eeeeee",
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },

  status: {
    marginTop: 4,
    fontSize: 13,
    color: "#555555",
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },

  registeredButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000000",
  },

  actionButtonText: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 28,
  },

  registeredButtonText: {
    color: "#000000",
  },
});
