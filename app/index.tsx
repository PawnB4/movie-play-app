import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useMovieList } from "../api/movies.api";
import { useEffect, useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react-native";
import MovieFlatList from "@/components/MovieFlatList";
import DropdownSelector from "@/components/Picker";

export default function App() {
  const [posterMode, setPosterMode] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { session, loading } = useAuth();
  const [hasRefetched, setHasRefetched] = useState(false);

  const handleLayoutModeChange = () => {
    setPosterMode(!posterMode);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    isError,
  } = useMovieList(selectedGenre);

  const movies = data?.pages.flat() || [];

  useEffect(() => {
    if (error && !hasRefetched) {
      console.log("error detected, refetching");
      setHasRefetched(true);
      refetch();
    }
  }, [error, hasRefetched, refetch]);

  useEffect(() => {
    if (data) {
      setHasRefetched(false); // Reset refetch state on successful data fetch
    }
  }, [data]);

  if (!session) {
    return <Redirect href={"/logout"} />;
  }

  if (loading || isLoading) {
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

  if (error || isError) {
    return (
      <View
        style={{
          padding: 12,
          backgroundColor: "#131A22",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 48,
        }}
      >
        <Text style={{ color: "#E6DFC5", fontSize: 18, fontWeight: "700" }}>
          UNABLE TO FETCH MOVIES
        </Text>
        <Pressable
          style={styles.saveButton}
          onPress={() => {
            setHasRefetched(false);
            refetch();
          }}
        >
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        <DropdownSelector
          onSelectGenre={handleGenreChange}
          selectedGenre={selectedGenre}
        />
        {posterMode ? (
          <Pressable onPress={() => setPosterMode(!posterMode)}>
            <LayoutList size={25} color={"#E6DFC5"} />
          </Pressable>
        ) : (
          <Pressable onPress={() => setPosterMode(!posterMode)}>
            <LayoutGrid size={25} color={"#E6DFC5"} />
          </Pressable>
        )}
      </View>

      <MovieFlatList
        data={movies}
        posterMode={posterMode}
        onLayoutModeChange={handleLayoutModeChange}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#131A22",
  },
  top_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  categories_style: {
    color: "#CAC4D0",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#86828C",
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  flatListStyle: {
    flex: 1,
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
