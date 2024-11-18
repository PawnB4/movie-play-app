import MovieFlatList from "@/components/MovieFlatList";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  TextSearch,
  SearchX,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useSearch } from "@/providers/SearchProvider";
import { Redirect } from "expo-router";
import { useSearchMovie } from "@/api/movies.api";
import { useAuth } from "@/providers/AuthProvider";

const Search = () => {
  const { searchString, setSearchString } = useSearch();
  const [sortBy, setSortBy] = useState("release_date");
  const [order, setOrder] = useState("DESC");
  const { session } = useAuth();
  const [hasRefetched, setHasRefetched] = useState(false);

  const {
    isLoading,
    data,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
    isError,
  } = useSearchMovie(searchString, sortBy, order);

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

  if (searchString === "") {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          gap: 20,
          backgroundColor: "#131A22",
          height: "100%",
        }}
      >
        <TextSearch size={250} strokeWidth={1} color={"#E6DFC5"} />
        <Text style={{ fontSize: 20, color: "#E6DFC5" }}>
          Search movies, actors
        </Text>
      </View>
    );
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

  if (movies?.length === 0) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          gap: 20,
          backgroundColor: "#131A22",
          height: "100%",
        }}
      >
        <SearchX size={250} strokeWidth={1} color={"#E6DFC5"} />
        <Text style={{ fontSize: 20, color: "#E6DFC5" }}>
          No results found for '{searchString}'
        </Text>
      </View>
    );
  }

  const toggleSortByRating = () => {
    setSortBy("average_rating");
    setOrder((prevOrder) => (prevOrder === "DESC" ? "ASC" : "DESC"));
    refetch(); // Refetch data with new sort order
  };

  const toggleSortByReleaseDate = () => {
    setSortBy("release_date");
    setOrder((prevOrder) => (prevOrder === "DESC" ? "ASC" : "DESC"));
    refetch(); // Refetch data with new sort order
  };

  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        {/* RATING */}
        <Pressable
          style={styles.filter_container_style}
          onPress={toggleSortByRating}
        >
          <View style={styles.filter_inner_child}>
            <Text style={styles.filter_text_style}>Rating</Text>
            {sortBy === "average_rating" && order === "DESC" ? (
              <ChevronDown size={25} color={"#E6DFC5"} />
            ) : sortBy === "average_rating" && order === "ASC" ? (
              <ChevronUp size={25} color={"#E6DFC5"} />
            ) : (
              <Minus size={25} color={"#E6DFC5"} />
            )}
          </View>
        </Pressable>
        {/* RELEASE DATE */}
        <Pressable
          style={styles.filter_container_style}
          onPress={toggleSortByReleaseDate}
        >
          <View style={styles.filter_inner_child}>
            <Text style={styles.filter_text_style}>Release Date</Text>
            {sortBy === "release_date" && order === "DESC" ? (
              <ChevronDown size={25} color={"#E6DFC5"} />
            ) : sortBy === "release_date" && order === "ASC" ? (
              <ChevronUp size={25} color={"#E6DFC5"} />
            ) : (
              <Minus size={25} color={"#E6DFC5"} />
            )}
          </View>
        </Pressable>
      </View>
      <MovieFlatList
        data={movies}
        posterMode={false}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </View>
  );
};

export default Search;

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
  filter_container_style: {
    borderWidth: 1,
    borderColor: "#86828C",
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  filter_inner_child: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    gap: 6,
  },
  filter_text_style: {
    color: "#CAC4D0",
    fontSize: 18,
  },
  flatListStyle: {
    flex: 1,
  },
});
