import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { usePlans } from "../PlanContext";

export default function ProjectScreen() {
  const { projects } = usePlans();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          PROJECT
        </Text>

        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push("/new-project")
          }
        >
          <Text
            style={styles.addButtonText}
          >
            ＋
          </Text>
        </Pressable>
      </View>

      <Text style={styles.description}>
        プロジェクトを選択してください
      </Text>

      <ScrollView
        contentContainerStyle={
          styles.list
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {projects.map((project) => (
          <Pressable
            key={project.id}
            style={styles.projectCard}
            onPress={() =>
              router.push({
                pathname: "/choose",
                params: {
                  projectId:
                    project.id,
                  projectName:
                    project.name,
                },
              })
            }
          >
            {project.imageUri && (
              <Image
                source={{
                  uri: project.imageUri,
                }}
                style={
                  styles.projectImage
                }
                resizeMode="cover"
              />
            )}

            <Text
              style={styles.projectName}
            >
              {project.name}
            </Text>

            <Text
              style={styles.projectDate}
            >
              {project.date}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
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
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#176584",
    letterSpacing: 0.5,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#176584",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "400",
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#647289",
    marginBottom: 20,
  },

  list: {
    gap: 14,
    paddingBottom: 24,
  },

  projectCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  projectImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
    marginBottom: 14,
  },

  projectName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1E293B",
  },

  projectDate: {
    fontSize: 14,
    color: "#647289",
  },
});