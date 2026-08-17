import * as ImagePicker from "expo-image-picker";
import {
  router,
  useLocalSearchParams,
} from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { usePlans } from "../PlanContext";

export default function TitleScreen() {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] =
    useState<string | null>(null);

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

  const { addPlan } = usePlans();

  const handlePickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

    if (!result.canceled) {
      setImageUri(
        result.assets[0].uri,
      );
    }
  };

  const handleDecide = () => {
    if (
      title.trim() === "" ||
      !projectId
    ) {
      return;
    }

    addPlan(
      projectId,
      title.trim(),
      imageUri ?? undefined,
    );

    router.back();
  };

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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionLabel}>
          IDEAL PLAN
        </Text>

        <Text style={styles.projectName}>
          {projectName}
        </Text>

        <Text style={styles.title}>
          予定を追加
        </Text>

        <Text style={styles.description}>
          理想の体験に向けた予定を入力してください
        </Text>

        {/* 予定 */}
        <Text style={styles.label}>
          予定
        </Text>

        <TextInput
          style={styles.input}
          placeholder="例：温泉に行く"
          placeholderTextColor="#94A3B8"
          value={title}
          onChangeText={setTitle}
          returnKeyType="done"
          autoFocus
        />

        {/* IMAGE PHOTO */}
        <Text style={styles.label}>
          IMAGE PHOTO
        </Text>

        <Pressable
          style={styles.imagePicker}
          onPress={handlePickImage}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <>
              <Text
                style={styles.imagePlus}
              >
                ＋
              </Text>

              <Text
                style={styles.imagePickerText}
              >
                写真を選択
              </Text>
            </>
          )}
        </Pressable>

        {imageUri && (
          <Text style={styles.imageHint}>
            タップして写真を変更
          </Text>
        )}

        {/* 決定 */}
        <Pressable
          style={[
            styles.nextButton,
            !title.trim() &&
              styles.disabledButton,
          ]}
          onPress={handleDecide}
          disabled={!title.trim()}
        >
          <Text style={styles.buttonText}>
            追加する
          </Text>
        </Pressable>

        {/* もどる */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            もどる
          </Text>
        </Pressable>
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
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
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
    marginBottom: 28,
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
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    width: "100%",
    height: 56,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    fontSize: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },

  imagePicker: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  previewImage: {
    width: "100%",
    height: "100%",
  },

  imagePlus: {
    fontSize: 32,
    color: "#176584",
    marginBottom: 4,
  },

  imagePickerText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#176584",
  },

  imageHint: {
    fontSize: 13,
    color: "#647289",
    textAlign: "center",
    marginTop: 8,
  },

  nextButton: {
    height: 56,
    marginTop: 24,
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

  disabledButton: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },

  backText: {
    color: "#647289",
    fontSize: 15,
    fontWeight: "600",
  },
});