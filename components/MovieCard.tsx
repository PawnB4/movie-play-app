import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { ChevronRight, Star, CalendarDays, Clock } from "lucide-react-native";

function formatRuntime(runtime) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}min`;
}

const MovieCard = ({ movie, posterMode }) => {
  if (posterMode) {
    return (
      <Link href={`/movie-detail/${movie.id}`} asChild>
        <Pressable style={styles.movie_container_poster}>
          <Image
            source={movie.poster_url}
            style={{ width: posterMode ? "100%" : "30%", aspectRatio: 0.667 }}
          />
          <View style={styles.movie_info_poster}>
            <View style={styles.infoText_container}>
              <Star size={15} color={"#F5C937"} fill={"#F5C937"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                }}
              >
                {Number(movie.average_rating).toFixed(1)}
              </Text>
            </View>
            <Text style={styles.title_poster}>{movie.title}</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.infoText_container}>
                <CalendarDays size={12} color={"#DCDCDC"} />
                <Text
                  style={{
                    color: "#DCDCDC",
                    flexShrink: 1,
                    fontSize: 10,
                  }}
                >
                  {new Date(movie.release_date).getFullYear()}
                </Text>
              </View>
              <View style={styles.infoText_container}>
                <Clock size={12} color={"#DCDCDC"} />
                <Text
                  style={{
                    color: "#DCDCDC",
                    flexShrink: 1,
                    fontSize: 10,
                  }}
                >
                  {formatRuntime(movie.runtime)}
                </Text>
              </View>
            </View>
          </View>
          {!posterMode && (
            <View style={styles.arrowContainer}>
              <ChevronRight size={25} color={"#DCDCDC"} />
            </View>
          )}
        </Pressable>
      </Link>
    );
  } else {
    return (
      <Link href={`/movie-detail/${movie.id}`} asChild>
        <Pressable style={styles.movie_container_card}>
          <Image
            source={movie.poster_url}
            style={{ width: posterMode ? "100%" : "30%", aspectRatio: 0.667 }}
          />
          <View style={styles.movie_info_card}>
            <Text style={styles.title_card}>{movie.title}</Text>
            <View style={styles.infoText_container}>
              <Star size={20} color={"#F5C937"} fill={"#F5C937"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                }}
              >
                {Number(movie.average_rating).toFixed(1)} ({movie.vote_count})
              </Text>
            </View>

            <View style={styles.infoText_container}>
              <CalendarDays size={20} color={"#DCDCDC"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                }}
              >
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </View>
            <View style={styles.infoText_container}>
              <Clock size={20} color={"#DCDCDC"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                }}
              >
                {formatRuntime(movie.runtime)}
              </Text>
            </View>
          </View>
          {!posterMode && (
            <View style={styles.arrowContainer}>
              <ChevronRight size={25} color={"#DCDCDC"} />
            </View>
          )}
        </Pressable>
      </Link>
    );
  }
};

export default MovieCard;

const styles = StyleSheet.create({
  movie_container_card: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    padding: 8,
    gap: 16,
  },
  movie_container_poster: {
    flex: 1,
    justifyContent: "space-between",
    padding: 8,
    maxWidth:"50%"
  },
  movie_info_poster: {
    flex: 1,
    display: "flex",
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 10,
    justifyContent: "space-around",
    backgroundColor: "#302E33",
  },
  movie_info_card: {
    flex: 1,
    display: "flex",
    gap: 6,
    justifyContent: "space-around",
  },
  title_poster: {
    color: "#DCDCDC",
    fontSize: 16,
    fontWeight: "bold",
    flexShrink: 1,
  },
  title_card: {
    color: "#DCDCDC",
    fontSize: 22,
    fontWeight: "bold",
    flexShrink: 1,
  },
  infoText_container: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  arrowContainer: {
    justifyContent: "center",
  },
});
