import { StyleSheet, View } from "react-native";
import {
  Search,
  CircleUserRound,
  Popcorn,
} from "lucide-react-native";
import { Link } from "expo-router";

const HomeScreenHeader = () => {
  return (
    <View style={styles.container}>
      <Link href={"/search/"}>
        <Search size={25} color={"#000"} />
      </Link>
      <View style={styles.child_container}>
        <Link href={"/favorites/"}>
          <Popcorn size={25} color={"#000"} />
        </Link>
        <Link href={"/profile/"}>
          <CircleUserRound size={25} color={"#000"} />
        </Link>
      </View>
    </View>
  );
};

export default HomeScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 130,
    paddingTop: 60,
    paddingBottom: 5,
    paddingHorizontal: 28,
    backgroundColor: "#E6DFC5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // X, Y - positive Y value puts the shadow below the box
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  child_container: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
});
