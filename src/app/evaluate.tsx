import * as ImagePicker from "expo-image-picker";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import {
  useEffect,
  useState,
} from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

export default function EvaluateScreen() {
  const params =
    useLocalSearchParams<{
      projectId?: string;
      projectName?: string;
      selectedPlanIndexes?: string;
      currentPlanPosition?: string;
    }>();

  const projectId =
    params.projectId || "";

  const projectName =
    params.projectName ||
    "プロジェクト";

  const {
    getPlans,
    evaluationItems,
    saveEvaluation,
    getEvaluation,
    addEvaluationItem,
  } = usePlans();

  /*
   * RealPlanで選択されたプランのindex一覧
   */
  const selectedPlanIndexes = (() => {
    if (!params.selectedPlanIndexes) {
      return [];
    }

    try {
      const parsed = JSON.parse(
        params.selectedPlanIndexes,
      );

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (value): value is number =>
          typeof value === "number" &&
          Number.isInteger(value) &&
          value >= 0,
      );
    } catch {
      return [];
    }
  })();

  /*
   * 現在何番目のプランを評価しているか
   */
  const currentPlanPosition = Number(
    params.currentPlanPosition ?? "0",
  );

  const planIndex =
    selectedPlanIndexes[
      currentPlanPosition
    ] ?? -1;

  const plans = getPlans(projectId);

  const currentPlan =
    planIndex >= 0 &&
    planIndex < plans.length
      ? plans[planIndex]
      : undefined;

  const planName =
    currentPlan?.title ?? "プラン";

  const planImageUri =
    currentPlan?.imageUri;

  /*
   * CHECKで登録されている評価項目だけを
   * 今回の評価対象にする。
   */
  const registeredItems =
    evaluationItems.filter(
      (item) => item.registered,
    );

  const [
    evaluations,
    setEvaluations,
  ] = useState<
    Record<
      string,
      boolean | undefined
    >
  >({});

  const [
    newItems,
    setNewItems,
  ] = useState<string[]>([""]);

  const [
    realPhotoUri,
    setRealPhotoUri,
  ] = useState<string | null>(
    null,
  );

  /*
   * 保存済みの評価を復元
   */
  useEffect(() => {
    if (
      !projectId ||
      planIndex < 0
    ) {
      return;
    }

    const saved =
      getEvaluation(
        projectId,
        planIndex,
      );

    if (!saved) {
      return;
    }

    setEvaluations(
      saved.evaluations,
    );

    setNewItems(
      saved.newItems.length > 0
        ? saved.newItems
        : [""],
    );

    setRealPhotoUri(
      saved.realPhotoUri,
    );
  }, [
    projectId,
    planIndex,
    getEvaluation,
  ]);

  const handlePickRealPhoto =
    async () => {
      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          },
        );

      if (!result.canceled) {
        setRealPhotoUri(
          result.assets[0].uri,
        );
      }
    };

  const toggleEvaluation = (
    itemId: string,
    value: boolean,
  ) => {
    setEvaluations(
      (current) => ({
        ...current,
        [itemId]: value,
      }),
    );
  };

  const addNewItem = () => {
    setNewItems(
      (current) => [
        ...current,
        "",
      ],
    );
  };

  const updateNewItem = (
    index: number,
    value: string,
  ) => {
    setNewItems(
      (current) =>
        current.map(
          (
            item,
            itemIndex,
          ) =>
            itemIndex === index
              ? value
              : item,
        ),
    );
  };

  const handleSave = () => {
    if (
      !projectId ||
      planIndex < 0 ||
      currentPlanPosition < 0 ||
      currentPlanPosition >=
        selectedPlanIndexes.length
    ) {
      return;
    }

    /*
     * 空欄は保存しない
     */
    const filteredItems =
      newItems
        .map((item) =>
          item.trim(),
        )
        .filter(
          (item) => item !== "",
        );

    /*
     * 新しく気付いた項目を
     * 評価項目マスタへ追加
     */
    filteredItems.forEach(
      (item) => {
        addEvaluationItem(item);
      },
    );

    /*
     * 現在のプランの評価を保存
     */
    saveEvaluation(
      projectId,
      planIndex,
      {
        evaluations,
        newItems:
          filteredItems,
        realPhotoUri,
      },
    );

    const nextPosition =
      currentPlanPosition + 1;

    /*
     * 次のプランがある場合
     */
    if (
      nextPosition <
      selectedPlanIndexes.length
    ) {
      router.replace({
        pathname: "/evaluate",
        params: {
          projectId,
          projectName,
          selectedPlanIndexes:
            JSON.stringify(
              selectedPlanIndexes,
            ),
          currentPlanPosition:
            String(nextPosition),
        },
      });

      return;
    }

    /*
     * すべて評価完了
     */
    router.replace({
      pathname: "/score",
      params: {
        projectId,
        projectName,
      },
    });
  };

  /*
   * 不正な遷移
   */
  if (
    !projectId ||
    selectedPlanIndexes.length ===
      0 ||
    planIndex < 0
  ) {
    return (
      <View
        style={styles.errorContainer}
      >
        <Text
          style={styles.errorTitle}
        >
          EVALUATE
        </Text>

        <Text
          style={styles.errorText}
        >
          評価対象のプランがありません。
        </Text>

        <Pressable
          style={styles.errorButton}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={
              styles.errorButtonText
            }
          >
            戻る
          </Text>
        </Pressable>
      </View>
    );
  }

  const evaluatedCount =
    Object.values(evaluations).filter(
      (value) =>
        value !== undefined,
    ).length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ヘッダー */}
        <Text style={styles.sectionLabel}>
          EVALUATE
        </Text>

        <Text
          style={styles.projectName}
        >
          {projectName}
        </Text>

        {/* プラン情報 */}
        <View
          style={styles.planHeader}
        >
          <View style={styles.planHeaderText}>
            <Text
              style={styles.planLabel}
            >
              EXPERIENCE
            </Text>

            <Text
              style={styles.planName}
            >
              {planName}
            </Text>
          </View>

          <View
            style={styles.progressBadge}
          >
            <Text
              style={
                styles.progressNumber
              }
            >
              {currentPlanPosition + 1}
            </Text>

            <Text
              style={
                styles.progressTotal
              }
            >
              / {selectedPlanIndexes.length}
            </Text>
          </View>
        </View>

        {/* 期待と現実 */}
        <View
          style={styles.section}
        >
          <Text
            style={styles.sectionTitle}
          >
            期待と現実
          </Text>

          <Text
            style={styles.sectionDescription}
          >
            事前のイメージと実際の体験を
            比較してください
          </Text>

          {/* 事前のイメージ */}
          <View
            style={styles.photoCard}
          >
            <View
              style={styles.cardHeader}
            >
              <View
                style={[
                  styles.cardDot,
                  styles.expectedDot,
                ]}
              />

              <Text
                style={styles.cardTitle}
              >
                EXPECTED
              </Text>
            </View>

            <View
              style={styles.photoPlaceholder}
            >
              {planImageUri ? (
                <Image
                  source={{
                    uri: planImageUri,
                  }}
                  style={styles.realPhoto}
                />
              ) : (
                <>
                  <Text
                    style={styles.placeholderIcon}
                  >
                    IMAGE
                  </Text>

                  <Text
                    style={styles.placeholderText}
                  >
                    事前のイメージ
                  </Text>
                </>
              )}
            </View>
          </View>

          {/* 実際の体験 */}
          <View
            style={styles.photoCard}
          >
            <View
              style={styles.cardHeader}
            >
              <View
                style={[
                  styles.cardDot,
                  styles.actualDot,
                ]}
              />

              <Text
                style={styles.cardTitle}
              >
                ACTUAL
              </Text>
            </View>

            <Pressable
              style={
                styles.photoPlaceholder
              }
              onPress={
                handlePickRealPhoto
              }
            >
              {realPhotoUri ? (
                <Image
                  source={{
                    uri: realPhotoUri,
                  }}
                  style={
                    styles.realPhoto
                  }
                />
              ) : (
                <>
                  <Text
                    style={
                      styles.placeholderIcon
                    }
                  >
                    ＋
                  </Text>

                  <Text
                    style={
                      styles.placeholderText
                    }
                  >
                    写真を選択
                  </Text>
                </>
              )}
            </Pressable>

            <Text
              style={styles.photoHint}
            >
              {realPhotoUri
                ? "タップして写真を変更"
                : "実際の体験を記録"}
            </Text>
          </View>
        </View>

        {/* 評価 */}
        <View
          style={styles.section}
        >
          <View
            style={styles.sectionHeader}
          >
            <View>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                評価
              </Text>

              <Text
                style={
                  styles.sectionDescription
                }
              >
                期待通りだったか選択してください
              </Text>
            </View>

            {registeredItems.length >
              0 && (
              <Text
                style={
                  styles.evaluationCount
                }
              >
                {evaluatedCount} /{" "}
                {registeredItems.length}
              </Text>
            )}
          </View>

          {registeredItems.length ===
          0 ? (
            <View
              style={
                styles.emptyCard
              }
            >
              <Text
                style={styles.emptyTitle}
              >
                評価項目がありません
              </Text>

              <Text
                style={styles.emptyText}
              >
                CHECKで評価項目を登録してください
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.evaluationList
              }
            >
              {registeredItems.map(
                (item) => {
                  const evaluation =
                    evaluations[
                      item.id
                    ];

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.evaluationRow,
                        evaluation !==
                          undefined &&
                          styles.evaluationRowActive,
                      ]}
                    >
                      <Text
                        style={
                          styles.itemName
                        }
                      >
                        {item.name}
                      </Text>

                      <View
                        style={
                          styles.resultButtons
                        }
                      >
                        {/* ○ */}
                        <Pressable
                          style={[
                            styles.resultButton,
                            evaluation ===
                              true &&
                              styles.selectedPositive,
                          ]}
                          onPress={() =>
                            toggleEvaluation(
                              item.id,
                              true,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.resultText,
                              evaluation ===
                                true &&
                                styles.selectedText,
                            ]}
                          >
                            ○
                          </Text>
                        </Pressable>

                        {/* × */}
                        <Pressable
                          style={[
                            styles.resultButton,
                            evaluation ===
                              false &&
                              styles.selectedNegative,
                          ]}
                          onPress={() =>
                            toggleEvaluation(
                              item.id,
                              false,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.resultText,
                              evaluation ===
                                false &&
                                styles.selectedText,
                            ]}
                          >
                            ×
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                },
              )}
            </View>
          )}
        </View>

        {/* 新しい気づき */}
        <View
          style={styles.section}
        >
          <View
            style={styles.sectionHeader}
          >
            <View
              style={styles.newItemTitleArea}
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                新しい気づき
              </Text>

              <Text
                style={
                  styles.sectionDescription
                }
              >
                次回のチェック項目につながります
              </Text>
            </View>

            <Pressable
              style={
                styles.addItemButton
              }
              onPress={addNewItem}
            >
              <Text
                style={
                  styles.addItemButtonText
                }
              >
                ＋
              </Text>
            </Pressable>
          </View>

          <View
            style={
              styles.newItemsList
            }
          >
            {newItems.map(
              (item, index) => (
                <TextInput
                  key={index}
                  style={styles.input}
                  value={item}
                  onChangeText={(
                    value,
                  ) =>
                    updateNewItem(
                      index,
                      value,
                    )
                  }
                  placeholder="新しく気付いたことを入力"
                  placeholderTextColor="#94A3B8"
                  multiline
                />
              ),
            )}
          </View>
        </View>

        {/* 保存 */}
        <Pressable
          style={
            styles.saveButton
          }
          onPress={handleSave}

        >
          <Text
            style={
              styles.saveButtonText
            }
          >
            {currentPlanPosition + 1 <
            selectedPlanIndexes.length
              ? "次のプランへ"
              : "評価を完了"}
          </Text>
        </Pressable>

        <Text
          style={styles.saveHint}
        >
          保存すると次の評価へ進みます
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 60,
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
    marginBottom: 24,
  },

  planHeader: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  planHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  planLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#647289",
    letterSpacing: 1,
    marginBottom: 5,
  },

  planName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#176584",
  },

  progressBadge: {
    minWidth: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EEF6F8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  progressNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#176584",
  },

  progressTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#647289",
    marginTop: 5,
  },

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },

  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#647289",
  },

  evaluationCount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#176584",
    paddingBottom: 2,
  },

  photoCard: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  cardDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  expectedDot: {
    backgroundColor: "#94A3B8",
  },

  actualDot: {
    backgroundColor: "#176584",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#647289",
    letterSpacing: 1,
  },

  photoPlaceholder: {
    height: 150,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  realPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  placeholderIcon: {
    fontSize: 22,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 4,
  },

  placeholderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#647289",
  },

  photoHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#647289",
    textAlign: "center",
  },

  evaluationList: {
    gap: 10,
  },

  evaluationRow: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  evaluationRowActive: {
    borderColor: "#CBD5E1",
  },

  itemName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    paddingRight: 12,
  },

  resultButtons: {
    flexDirection: "row",
    gap: 8,
  },

  resultButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  selectedPositive: {
    backgroundColor: "#176584",
    borderColor: "#176584",
  },

  selectedNegative: {
    backgroundColor: "#475569",
    borderColor: "#475569",
  },

  resultText: {
    fontSize: 21,
    fontWeight: "600",
    color: "#647289",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  emptyCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 13,
    color: "#647289",
  },

  newItemTitleArea: {
    flex: 1,
  },

  addItemButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#176584",
    alignItems: "center",
    justifyContent: "center",
  },

  addItemButtonText: {
    color: "#FFFFFF",
    fontSize: 23,
    lineHeight: 27,
  },

  newItemsList: {
    gap: 10,
  },

  input: {
    minHeight: 84,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    fontSize: 15,
    lineHeight: 21,
    color: "#1E293B",
    textAlignVertical: "top",
    backgroundColor: "#FFFFFF",
  },

  saveButton: {
    height: 56,
    marginTop: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  saveHint: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
  },

  errorContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    marginBottom: 12,
  },

  errorText: {
    fontSize: 14,
    color: "#647289",
    marginBottom: 24,
  },

  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#176584",
  },

  errorButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});