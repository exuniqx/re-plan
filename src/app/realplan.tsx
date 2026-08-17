import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

export default function RealPlanScreen() {
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

  const {
    getPlans,
    getCompletedPlans,
    togglePlan,
  } = usePlans();

  const plans = getPlans(projectId);
  const completedPlans =
    getCompletedPlans(projectId);

  // ☑されたプランのindexだけを取得
  const selectedPlanIndexes =
    plans
      .map((_, index) => index)
      .filter(
        (index) =>
          completedPlans[index] === true,
      );

  const handleComplete = () => {
    // 1つも選択されていない場合は進まない
    if (
      selectedPlanIndexes.length === 0
    ) {
      return;
    }

    /*
     * ☑されたプランだけをEvaluateで評価する。
     */
    router.push({
      pathname: "/evaluate",
      params: {
        projectId,
        projectName,
        selectedPlanIndexes:
          JSON.stringify(
            selectedPlanIndexes,
          ),
        currentPlanPosition: "0",
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.sectionLabel}>
          REAL PLAN
        </Text>

        <Text style={styles.projectName}>
          {projectName}
        </Text>

        <Text style={styles.title}>
          実際に体験した予定
        </Text>

        <Text style={styles.description}>
          評価したい予定を選択してください
        </Text>
      </View>

      {/* 予定一覧 */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={
          styles.listContent
        }
        showsVerticalScrollIndicator={false}
      >
        {plans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              まだ予定がありません
            </Text>
          </View>
        ) : (
          plans.map((plan, index) => {
            const completed =
              completedPlans[index] ??
              false;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.planItem,
                  completed &&
                    styles.selectedPlanItem,
                ]}
                onPress={() =>
                  togglePlan(
                    projectId,
                    index,
                  )
                }
                activeOpacity={0.8}
              >
                {/* チェックボックス */}
                <View
                  style={[
                    styles.checkbox,
                    completed &&
                      styles.checked,
                  ]}
                >
                  {completed && (
                    <Text
                      style={styles.check}
                    >
                      ✓
                    </Text>
                  )}
                </View>

                {/* 予定名 */}
                <View
                  style={styles.planInfo}
                >
                  <Text
                    style={[
                      styles.planText,
                      completed &&
                        styles.completedText,
                    ]}
                  >
                    {plan.title}
                  </Text>

                  {completed && (
                    <Text
                      style={
                        styles.selectedLabel
                      }
                    >
                      評価対象
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* 下部アクション */}
      <View style={styles.bottomArea}>
        <Text style={styles.selectionCount}>
          {selectedPlanIndexes.length > 0
            ? `${selectedPlanIndexes.length}件を評価`
            : "評価する予定を選択してください"}
        </Text>

        {/* 完了 */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            selectedPlanIndexes.length ===
              0 &&
              styles.disabledButton,
          ]}
          onPress={handleComplete}
          disabled={
            selectedPlanIndexes.length ===
            0
          }
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            評価へ進む
          </Text>
        </TouchableOpacity>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
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
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#647289",
    marginBottom: 20,
  },

  list: {
    flex: 1,
    paddingHorizontal: 20,
  },

  listContent: {
    paddingBottom: 20,
    gap: 12,
  },

  planItem: {
    minHeight: 72,
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
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  selectedPlanItem: {
    borderWidth: 2,
    borderColor: "#176584",
    backgroundColor: "#EEF6F8",
  },

  checkbox: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: "#176584",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#FFFFFF",
  },

  checked: {
    backgroundColor: "#176584",
  },

  check: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  planInfo: {
    flex: 1,
  },

  planText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
  },

  completedText: {
    color: "#176584",
  },

  selectedLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#176584",
  },

  emptyCard: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#647289",
  },

  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#F8FAFC",
  },

  selectionCount: {
    textAlign: "center",
    fontSize: 13,
    color: "#647289",
    marginBottom: 10,
  },

  completeButton: {
    height: 56,
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

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },

  backText: {
    color: "#647289",
    fontSize: 15,
    fontWeight: "600",
  },
});