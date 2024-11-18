import { FlatList, StyleSheet, View } from "react-native";
import MovieCard from "./MovieCard";
import MovieCardFavorite from "./MovieCard-favorite";

interface MovieFlatListProps {
  data: [];
  posterMode: boolean;
  onLayoutModeChange: () => void;
  type: string;
}

const MovieFlatList = ({
  data,
  posterMode,
  type,
  fetchNextPage,
  hasNextPage,
}) => {
  const numColumns = posterMode ? 2 : 1;

  return (
    <FlatList
      style={styles.flatListStyle}
      data={data}
      renderItem={({ item }) =>
        type === "favorite" ? (
          <MovieCardFavorite movie={item} />
        ) : (
          <MovieCard movie={item} posterMode={posterMode} />
        )
      }
      key={numColumns}
      numColumns={numColumns}
      contentContainerStyle={{ gap: 12 }}
      columnWrapperStyle={posterMode ? { gap: 12 } : null}
      ItemSeparatorComponent={
        !posterMode
          ? () => (
              <View
                style={{
                  height: 10,
                  borderBottomColor: "#29313B",
                  borderBottomWidth: 0.8,
                }}
              />
            )
          : null
      }
      onEndReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
};

export default MovieFlatList;

const styles = StyleSheet.create({
  flatListStyle: {
    flex: 1,
  },
});
