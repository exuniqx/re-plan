import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

const MAX_SCORE = 100;

// プロジェクト全体に対する「×」による最大減点
const EVALUATION_PENALTY = 40;

// 新しく気づいた項目1個あたりの減点
const NEW_ITEM_PENALTY = 10;

export default function ScoreScreen() {
  const params = useLocalSearchParams<{
    projectId?: string;
    projectName?: string;
  }>();

  const projectId = params.projectId || "";
  const projectName =
    params.projectName || "プロジェクト";

  const {
    getPlans,
    getEvaluation,
  } = usePlans();

  /*
   * プロジェクト内の全プランを取得
   */
  const plans = getPlans(projectId);

  /*
   * プロジェクト全体の評価結果を集計
   */
  let totalItemCount = 0;
  let totalFalseCount = 0;
  let totalTrueCount = 0;
  let totalNewItemCount = 0;
  let evaluatedPlanCount = 0;

  plans.forEach((_, planIndex) => {
    const evaluation = getEvaluation(
      projectId,
      planIndex,
    );

    // まだ評価していないプランは集計しない
    if (!evaluation) {
      return;
    }

    evaluatedPlanCount++;

    const evaluationValues = Object.values(
      evaluation.evaluations,
    );

    /*
     * ○・×が実際に入力されている
     * 評価項目だけを対象にする。
     */
    const answeredValues =
      evaluationValues.filter(
        (value) =>
          value === true ||
          value === false,
      );

    totalItemCount += answeredValues.length;

    totalTrueCount += answeredValues.filter(
      (value) => value === true,
    ).length;

    totalFalseCount += answeredValues.filter(
      (value) => value === false,
    ).length;

    totalNewItemCount +=
      evaluation.newItems.length;
  });

  /*
   * ×の割合
   *
   * 評価した項目だけを母数にする。
   */
  const evaluationPenalty =
    totalItemCount > 0
      ? EVALUATION_PENALTY *
        (totalFalseCount /
          totalItemCount)
      : 0;

  /*
   * 新しく気づいた項目による減点
   */
  const newItemPenalty =
    NEW_ITEM_PENALTY *
    totalNewItemCount;

  /*
   * 最終スコア
   */
  const score = Math.max(
    0,
    Math.round(
      MAX_SCORE -
        evaluationPenalty -
        newItemPenalty,
    ),
  );

  /*
   * 評価データが1件もない場合
   */
  if (evaluatedPlanCount === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          SCORE
        </Text>

        <Text style={styles.projectName}>
          {projectName}
        </Text>

        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            まだ評価データがありません
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            戻る
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
      {/* ヘッダー */}
      <View style={styles.headerArea}>
        <Text style={styles.header}>
          SCORE
        </Text>

        <Text style={styles.projectName}>
          {projectName}
        </Text>
      </View>

      {/* スコア */}
      <View style={styles.scoreCard}>
        <Text style={styles.scoreLabel}>
          SCORE
        </Text>

        <Text style={styles.score}>
          {score}
          <Text style={styles.scoreUnit}>
            点
          </Text>
        </Text>
      </View>

      {/* 評価結果 */}
      <View style={styles.detailCard}>
        <Text style={styles.sectionTitle}>
          評価結果
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            評価したプラン
          </Text>

          <Text style={styles.detailValue}>
            {evaluatedPlanCount}件
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            評価項目
          </Text>

          <Text style={styles.detailValue}>
            {totalItemCount}項目
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.labelWithMark}>
            <View
              style={[
                styles.resultMark,
                styles.goodMark,
              ]}
            >
              <Text style={styles.goodMarkText}>
                ○
              </Text>
            </View>

            <Text style={styles.detailLabel}>
              良かった項目
            </Text>
          </View>

          <Text style={styles.detailValue}>
            {totalTrueCount}項目
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.labelWithMark}>
            <View
              style={[
                styles.resultMark,
                styles.badMark,
              ]}
            >
              <Text style={styles.badMarkText}>
                ×
              </Text>
            </View>

            <Text style={styles.detailLabel}>
              改善が必要な項目
            </Text>
          </View>

          <Text style={styles.detailValue}>
            {totalFalseCount}項目
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            ×による減点
          </Text>

          <Text style={styles.penalty}>
            -{Math.round(evaluationPenalty)}点
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            新しく気づいたこと
          </Text>

          <Text style={styles.detailValue}>
            {totalNewItemCount}個
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>
            新規項目による減点
          </Text>

          <Text style={styles.penalty}>
            -{newItemPenalty}点
          </Text>
        </View>
      </View>

      {/* 戻る */}
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          pressed &&
            styles.buttonPressed,
        ]}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>
          戻る
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },

  content: {
  paddingBottom: 32,
},

  headerArea: {
    marginBottom: 24,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    letterSpacing: 0.5,
  },

  projectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#647289",
    marginTop: 6,
  },

  scoreCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  scoreLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#647289",
    letterSpacing: 1,
    marginBottom: 4,
  },

  score: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: "800",
    color: "#176584",
  },

  scoreUnit: {
    fontSize: 22,
    fontWeight: "700",
    color: "#176584",
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 20,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 10,
  },

  detailRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  detailLabel: {
    fontSize: 15,
    color: "#475569",
  },

  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#176584",
  },

  labelWithMark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  resultMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  goodMark: {
    backgroundColor: "#DCFCE7",
  },

  badMark: {
    backgroundColor: "#FEE2E2",
  },

  goodMarkText: {
    color: "#16A34A",
    fontSize: 16,
    fontWeight: "700",
  },

  badMarkText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 8,
  },

  penalty: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },

  emptyCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 24,
  },

  emptyText: {
    fontSize: 15,
    color: "#647289",
  },

  backButton: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "#176584",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
  },

  buttonPressed: {
    opacity: 0.75,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});