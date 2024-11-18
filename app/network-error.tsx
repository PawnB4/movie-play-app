import { Pressable, StyleSheet, Text, View } from "react-native";
import { WifiOff } from "lucide-react-native";
import { useNetworkStatus } from "@/providers/NetworkProvider";
import { router } from "expo-router";

const networkErrorScreen = () => {
  const { isConnected } = useNetworkStatus();
  return (
    <View style={styles.container}>
      <WifiOff size={250} strokeWidth={1} color={"#E6DFC5"} />
      <Text style={styles.text}>No internet connection</Text>
      <Pressable
        style={styles.saveButton}
        onPress={() => {
          if (isConnected) {
            router.replace("/");
          }
        }}
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
};

export default networkErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131A22",
    alignItems: "center",
    gap: 50,
    justifyContent: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  buttonText: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: 0.25,
    color: "black",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#4EFCA5",
  },
});
