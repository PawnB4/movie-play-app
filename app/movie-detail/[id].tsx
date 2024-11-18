import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  ScrollView,
  Button,
  Dimensions,
  Share,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import {
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useGetMovieById } from "@/api/movies.api";
import { useAuth } from "@/providers/AuthProvider";
import { useCallback, useEffect, useState } from "react";
import { useFavoriteMovieContext } from "@/providers/FavoriteMovieProvider";
import { ChevronLeft, Heart, Share2, User } from "lucide-react-native";
import { Star, CalendarDays, Clock } from "lucide-react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import * as ScreenOrientation from "expo-screen-orientation";

const MovieDetail = () => {
  const { session } = useAuth();
  const { id } = useLocalSearchParams();
  const { favorites, toggleFavoriteMovie } = useFavoriteMovieContext();
  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = useGetMovieById(Number(id));
  const [isFavoriteMovie, setIsFavoriteMovie] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  function formatRuntime(runtime) {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}min`;
  }

  useEffect(() => {
    if (movie) {
      const checkFavorite = favorites.some((movieId) => movieId == movie.id);
      setIsFavoriteMovie(checkFavorite);
    }
  }, [movie, favorites]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const onFullScreen = useCallback((isFullScreen) => {
    if (isFullScreen) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }, []);

  const handleToggleFavorite = () => {
    if (movie) {
      toggleFavoriteMovie(movie.id);
      setIsFavoriteMovie((prev) => !prev);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Movie Play | Explore ${movie.title}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  if (!session) {
    return <Redirect href="/logout" />;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E6DFC5" />
      </View>
    );
  }

  if (error) {
    return <Text style={{ color: "white" }}>Failed to fetch movie</Text>;
  }

  if (movie) {
    const fullText = movie.overview;
    const cast = movie.actors;
    const crew = (crew) => {
      const crewMap = new Map();

      crew.forEach((member) => {
        if (crewMap.has(member.id)) {
          crewMap.get(member.id).roles.push(member.role);
        } else {
          crewMap.set(member.id, {
            ...member,
            roles: [member.role],
          });
        }
      });

      return Array.from(crewMap.values());
    };
    return (
      <ScrollView style={styles.screenContainer}>
        <View style={styles.header_container}>
          <Pressable onPress={() => router.back()}>
            <ChevronLeft size={30} color="#000" />
          </Pressable>
          <View style={styles.child_container}>
            <Pressable onPress={handleToggleFavorite}>
              <Heart
                size={25}
                color={isFavoriteMovie ? "#FC4E4D" : "#000"}
                fill={isFavoriteMovie ? "#FC4E4D" : "transparent"}
              />
            </Pressable>
            <Pressable onPress={onShare}>
              <Share2 size={25} color="#000" />
            </Pressable>
          </View>
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{movie.title}</Text>

          {movie.trailer_video_url ? (
            <View
              style={{
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              <YoutubeIframe
                videoId={
                  movie.trailer_video_url.split("v=")[1]?.split("&")[0] || null
                }
                height={220}
                onFullScreenChange={onFullScreen}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                backgroundColor: "#131A22",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 8,
                paddingBottom: 16,
              }}
            >
              <Image
                source={
                  movie.images.images.find((img) => img.aspect_ratio > 1).url
                }
                style={{
                  width: Dimensions.get("window").width - 40, // Full width minus margins
                  height: (Dimensions.get("window").width - 30) * 0.6, // Maintain aspect ratio
                  borderRadius: 10,
                }}
                contentFit="contain"
              />
            </View>
          )}

          <View style={styles.overview}>
            <Image
              source={movie.images.poster_url}
              style={{ aspectRatio: 0.67, width: 170 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.textOverview} numberOfLines={12}>
                {fullText}
              </Text>
              <Pressable
                style={styles.readMoreContainer}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.readMore}>Read More</Text>
              </Pressable>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              margin: 20,
            }}
          >
            <View style={styles.infoText_container}>
              <CalendarDays size={16} color={"#DCDCDC"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                  fontSize: 16,
                }}
              >
                {new Date(movie.release_date).getFullYear()}
              </Text>
            </View>
            <View style={styles.infoText_container}>
              <Clock size={16} color={"#DCDCDC"} />
              <Text
                style={{
                  color: "#DCDCDC",
                  flexShrink: 1,
                  fontSize: 16,
                }}
              >
                {formatRuntime(movie.runtime)}
              </Text>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              margin: 10,
            }}
          >
            <Pressable
              style={{
                backgroundColor: "#E6DFC5",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                alignItems: "center",
                width: "80%",
              }}
              onPress={() =>
                router.push(
                  `/movie-gallery?images=${encodeURIComponent(
                    JSON.stringify(movie.images.images)
                  )}`
                )
              }
            >
              <Text
                style={{ color: "#131A22", fontWeight: "bold", fontSize: 16 }}
              >
                Gallery
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              margin: 20,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Star size={18} color={"#000000"} fill={"#F5C937"} />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#DCDCDC",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {parseFloat(movie.average_rating).toFixed(1)}{" "}
                </Text>
                <Text style={{ color: "#DCDCDC" }}> / 10</Text>
              </View>
            </View>
            <Pressable
              onPress={() =>
                router.navigate(
                  `/movie-rate/${movie.id}/${encodeURIComponent(
                    movie.images.poster_url
                  )}`
                )
              }
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  marginHorizontal: 40,
                }}
              >
                <Star size={28} color={"#000000"} fill={"#F5C937"} />
                <Text
                  style={{
                    color: "#F5C937",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {"Rate Movie"}
                </Text>
              </View>
            </Pressable>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "#DCDCDC",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                {movie.vote_count} Rates
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: "#DCDCDC",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Cast
            </Text>
            <FlatList
              style={{ marginVertical: 10 }}
              horizontal
              data={cast}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
                >
                  {item.profile_path !== "null" && item.profile_path ? (
                    <Image
                      source={{ uri: item.profile_path }}
                      style={{
                        width: 95,
                        height: 100,
                        borderRadius: 50,
                      }}
                    />
                  ) : (
                    <View style={{ width: 95, height: 100, borderRadius: 50 }}>
                      <User size={90} color={"#E6DFC5"} />
                    </View>
                  )}

                  <Text
                    style={{
                      color: "#DCDCDC",
                      fontSize: 14,
                      marginTop: 7,
                      maxWidth: 150,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={{
                      color: "#A0A0A0",
                      fontSize: 12,
                      maxWidth: 150,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {item.character_name}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
          <View>
            <Text
              style={{
                color: "#DCDCDC",
                fontSize: 24,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Crew
            </Text>
            <FlatList
              style={{ marginVertical: 10 }}
              horizontal
              data={crew(movie.crew)}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    marginHorizontal: 10,
                  }}
                >
                  {item.profile_path !== "null" && item.profile_path ? (
                    <Image
                      source={{ uri: item.profile_path }}
                      style={{
                        width: 95,
                        height: 100,
                        borderRadius: 50,
                      }}
                    />
                  ) : (
                    <View style={{ width: 95, height: 100, borderRadius: 50 }}>
                      <User size={90} color={"#E6DFC5"} />
                    </View>
                  )}
                  <Text
                    style={{
                      color: "#DCDCDC",
                      fontSize: 14,
                      marginTop: 7,
                      maxWidth: 150,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <View>
                    {item.roles.map((role, index) => (
                      <Text
                        key={index}
                        style={{
                          color: "#A0A0A0",
                          fontSize: 12,
                          textAlign: "center",
                          maxWidth: 150,
                        }}
                        numberOfLines={1}
                      >
                        {role}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{fullText}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  return null; // Return null or some fallback UI if movie is not available
};

export default MovieDetail;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#131A22",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#131A22",
  },
  header_container: {
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
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#131A22",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DCDCDC",
    marginBottom: 10,
  },
  text: {
    color: "#DCDCDC",
    marginBottom: 10,
  },
  textOverview: {
    color: "#DCDCDC",
    fontSize: 16,
  },
  video: {
    height: 200,
    marginBottom: 20,
  },
  overview: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  readMore: {
    color: "#E6DFC5",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#131A22",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: {
    color: "#DCDCDC",
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: "center",
    padding: 10,
    backgroundColor: "#E6DFC5",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#131A22",
    fontSize: 16,
  },
  infoText_container: {
    display: "flex",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
});
