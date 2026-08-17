import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

export default function NewProjectScreen() {
  const { addProject } = usePlans();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [imageUri, setImageUri] =
    useState<string | null>(null);

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

  const handleCreate = () => {
    if (
      !name.trim() ||
      !date.trim()
    ) {
      return;
    }

    addProject(
      name,
      date,
      imageUri ?? undefined,
    );

    router.replace("/project");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        NEW PROJECT
      </Text>

      <Text style={styles.description}>
        新しいプロジェクトを作成します
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>
          プロジェクト名
        </Text>

        <TextInput
          style={styles.input}
          placeholder="プロジェクト名を入力"
          placeholderTextColor="#94A3B8"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
        />

        <Text style={styles.label}>
          日付
        </Text>

        <TextInput
          style={styles.input}
          placeholder="YYYY/MM/DD"
          placeholderTextColor="#94A3B8"
          value={date}
          onChangeText={setDate}
          returnKeyType="done"
          onSubmitEditing={
            Keyboard.dismiss
          }
        />

        <Text style={styles.label}>
          写真
        </Text>

        <Pressable
          style={styles.imageButton}
          onPress={handlePickImage}
        >
          <Text
            style={styles.imageButtonText}
          >
            {imageUri
              ? "画像を変更"
              : "写真を選択"}
          </Text>
        </Pressable>

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}

        <Pressable
          style={[
            styles.createButton,
            (!name.trim() ||
              !date.trim()) &&
              styles.disabledButton,
          ]}
          onPress={handleCreate}
          disabled={
            !name.trim() ||
            !date.trim()
          }
        >
          <Text
            style={styles.createButtonText}
          >
            作成
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#647289",
    marginBottom: 24,
  },

  form: {
    gap: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },

  imageButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#176584",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  imageButtonText: {
    color: "#176584",
    fontSize: 16,
    fontWeight: "600",
  },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginTop: 4,
  },

  createButton: {
    height: 56,
    marginTop: 16,
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
    opacity: 0.45,
  },

  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});