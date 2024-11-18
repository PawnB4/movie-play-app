import { useAuth } from "@/providers/AuthProvider";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { Star } from "lucide-react-native";
import { useCreateRating } from "@/api/ratings.api";

const MovieRate = () => {
  const { id, poster } = useLocalSearchParams();
  const { session } = useAuth();
  const [rating, setRating] = useState(0);
  const { mutate: createRating, isLoading, isError } = useCreateRating();

  if (!session) {
    return <Redirect href="/logout" />;
  }

  const handleSetRating = (rate) => {
    setRating(rate);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      createRating({ movieId: id, rating });
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {poster && <Image source={{ uri: poster }} style={styles.poster} />}
      <Text style={{ fontSize: 20, margin: 30 }}>
        How would you rate this movie ?
      </Text>
      <View style={styles.starsContainer}>
        {Array.from({ length: 10 }, (_, index) => (
          <Pressable key={index} onPress={() => handleSetRating(index + 1)}>
            <Star
              size={30}
              style={{ marginHorizontal: 1 }}
              color={index < rating ? "#F5C937" : "#000"}
              fill={index < rating ? "#F5C937" : "transparent"}
            />
          </Pressable>
        ))}
      </View>
      <Pressable
        style={[
          styles.submitButton,
          { backgroundColor: rating > 0 ? "#131A22" : "#B8B29E" },
        ]}
        onPress={handleSubmit}
        disabled={rating === 0}
      >
        <Text
          style={[
            styles.submitButtonText,
            { color: rating > 0 ? "#FFF" : "#000" },
          ]}
        >
          Submit
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#E6DFC5",
    paddingTop: 50,
  },
  poster: {
    width: 300,
    height: 420,
    borderRadius: 10,
    elevation: 5,
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: 20,
    position: "absolute",
    bottom: 150,
  },
  submitButton: {
    position: "absolute",
    bottom: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 5,
  },
  submitButtonText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MovieRate;
