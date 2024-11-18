import { StyleSheet, Text, View, Pressable } from "react-native";
import { X } from "lucide-react-native";
import { router } from "expo-router";

const MovieRateScreenHeader = ({ tabName }) => {
  return (
    <View style={styles.container}>
      <View style={styles.child_container}>
        <Text style={styles.name}>{tabName}</Text>
      </View>
      <Pressable onPress={() => router.back()} style={styles.back_arrow}>
        <X size={30} color={"#000"} />
      </Pressable>
    </View>
  );
};

export default MovieRateScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // This distributes space between child elements
    height: 130,
    paddingTop: 50,
    paddingHorizontal: 18,
    backgroundColor: "#E6DFC5",
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
  back_arrow: {
    zIndex: 999,
    padding: 10,
  },
});
