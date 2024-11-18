import { StyleSheet, Text, View, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { router } from "expo-router";

const GeneralScreenHeader = ({ tabName }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back_arrow}>
        <ChevronLeft size={30} color={"#000"} />
      </Pressable>
      <View style={styles.child_container}>
        <Text style={styles.name}>{tabName}</Text>
      </View>
    </View>
  );
};

export default GeneralScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: 130,
    paddingTop: 50,
    paddingHorizontal: 18,
    backgroundColor: "#E6DFC5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  child_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 76,
    alignItems: "center", // This centers the children horizontally within the child_container
  },
  name: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
  },
  back_arrow:{zIndex:999}
});
