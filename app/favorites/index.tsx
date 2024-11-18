import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MovieFlatList from "@/components/MovieFlatList";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { useFavoriteMovies } from "@/api/favorites.api";

const Favorites = () => {
  const { session } = useAuth();
  const { data: movies, isLoading, error } = useFavoriteMovies();

  if (!session) {
    return <Redirect href={"/logout"} />;
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#131A22",
        }}
      >
        <ActivityIndicator size="large" color="#E6DFC5" />
      </View>
    );
  }

  if (error) {
    return <Text style={{ color: "white" }}>Failed to fetch movie</Text>;
  }

  if (movies) {
    if (movies.length === 0) {
      return (
        <View style={styles.error_container}>
          <Text style={{ color: "#E6DFC5", fontSize: 18, fontWeight: "700" }}>
            No favorite movies
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <MovieFlatList
            data={movies}
            posterMode={false}
            onLayoutModeChange={() => {}}
            type={"favorite"}
          />
        </View>
      );
    }
  } else {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          padding: 10,
          backgroundColor: "#131A22",
        }}
      >
        <ActivityIndicator size="large" color="#E6DFC5" />
      </View>
    );
  }
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#131A22",
  },
  error_container: {
    padding: 12,
    backgroundColor: "#131A22",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "600",
    letterSpacing: 0.25,
    color: "black",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#4EFCA5",
  },
});
