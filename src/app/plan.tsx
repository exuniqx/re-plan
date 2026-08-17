import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

export default function PlanScreen() {
  const params =
    useLocalSearchParams<{
      projectId?: string;
      projectName?: string;
    }>();

  const projectId =
    params.projectId || "";

  const projectName =
    params.projectName ||
    "プロジェクト";

  const { getPlans } = usePlans();
  const plans = getPlans(projectId);

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.sectionLabel}>
            PROJECT
          </Text>

          <Text
            style={styles.projectName}
            numberOfLines={1}
          >
            {projectName}
          </Text>

          <Text style={styles.title}>
            IDEAL PLAN
          </Text>
        </View>

        <TouchableOpacity
          style={styles.plusButton}
          onPress={() =>
            router.push({
              pathname: "/title",
              params: {
                projectId,
                projectName,
              },
            })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.plusText}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        理想の予定を登録してください
      </Text>

      {/* 予定一覧 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {plans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              まだ予定がありません
            </Text>

            <Text
              style={styles.emptyDescription}
            >
              ＋ボタンから予定を追加できます
            </Text>
          </View>
        ) : (
          plans.map((plan, index) => (
  <View
    key={plan.id}
    style={styles.planItem}
  >
    <View style={styles.numberCircle}>
      <Text style={styles.numberText}>
        {index + 1}
      </Text>
    </View>

    <View style={styles.planInfo}>
      <Text style={styles.planText}>
        {plan.title}
      </Text>

      {plan.imageUri && (
        <Image
        source={{
          uri: plan.imageUri,
        }}
        style={styles.planImage}
        resizeMode="cover"
        />
      )}
    </View>
  </View>
))
        )}
      </ScrollView>

      {/* もどる */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={styles.backText}>
          もどる
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 20,
  },

  titleArea: {
    flex: 1,
    paddingRight: 16,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#647289",
    letterSpacing: 1,
    marginBottom: 4,
  },

  projectName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    letterSpacing: 0.5,
  },

  plusButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#176584",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  plusText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "400",
    lineHeight: 36,
  },

  description: {
    fontSize: 15,
    color: "#647289",
    marginTop: 16,
    marginBottom: 16,
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 110,
    gap: 12,
  },

  planItem: {
    minHeight: 70,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#B2BDE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  numberText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#176584",
  },

  planText: {
    flex: 1,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
    color: "#1E293B",
  },

  emptyCard: {
    padding: 28,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 6,
  },

  emptyDescription: {
    fontSize: 14,
    color: "#647289",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    paddingHorizontal: 40,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#176584",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  planInfo: {
    flex: 1,
  },

  planImage: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginTop: 10,
  },
});