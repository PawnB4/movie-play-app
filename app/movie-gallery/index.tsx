import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  Dimensions,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { X } from "lucide-react-native";

const Gallery = () => {
  const { images } = useLocalSearchParams();
  const images2 = images ? JSON.parse(decodeURIComponent(images)) : [];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedImageAspectRatio, setSelectedImageAspectRatio] = useState(1);

  if (!images2 || images2.length === 0) {
    return (
      <Text style={{ color: "white", textAlign: "center" }}>
        No images available
      </Text>
    );
  }

  // Function to determine if aspect ratio is less than 1
  const isAspectRatioLessThanOne = (aspectRatio) => {
    return aspectRatio < 1;
  };

  // Function to handle image click and show modal
  const handleImageClick = (imageUrl, aspectRatio) => {
    setSelectedImageUrl(imageUrl);
    setSelectedImageAspectRatio(aspectRatio);
    setModalVisible(true);
  };

  // Function to render images in the desired layout
  const renderImages = () => {
    let rows = [];
    let currentRow = [];

    images2.forEach((image, index) => {
      const aspectRatio = image.aspect_ratio;
      const imageUrl = image.url;

      // Check aspect ratio and determine layout
      if (isAspectRatioLessThanOne(aspectRatio)) {
        // If aspect ratio is less than 1, add to current row
        currentRow.push(
          <Pressable
            key={index}
            onPress={() => handleImageClick(imageUrl, aspectRatio)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </Pressable>
        );

        // Check if currentRow has 2 images (for aspect ratio < 1)
        if (currentRow.length === 2) {
          rows.push(
            <View style={styles.rowContainer} key={rows.length}>
              {currentRow}
            </View>
          );
          currentRow = []; // Reset currentRow
        }
      } else {
        // If aspect ratio is >= 1, add image alone in a row with full width
        rows.push(
          <View style={styles.fullWidthContainer} key={rows.length}>
            <Pressable onPress={() => handleImageClick(imageUrl, aspectRatio)}>
              <Image source={{ uri: imageUrl }} style={styles.fullWidthImage} />
            </Pressable>
          </View>
        );
      }
    });

    // Push any remaining images in currentRow (if aspect ratio < 1)
    if (currentRow.length > 0) {
      rows.push(
        <View style={styles.rowContainer} key={rows.length}>
          {currentRow}
        </View>
      );
    }

    return rows;
  };

  return (
    <ScrollView style={styles.galleryContainer}>
      {renderImages()}
      <Modal
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedImageUrl }}
              style={[
                styles.fullScreenImage,
                selectedImageAspectRatio > 1 && styles.landscapeImage,
              ]}
              contentFit="contain"
            />
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.closeText}>
                <X size={30} color={"#FFFFFF"} />
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  galleryContainer: {
    backgroundColor: "#131A22",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  fullWidthContainer: {
    margin: 10,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: Dimensions.get("window").width / 2 - 15, // Adjust as per your layout
    height: Dimensions.get("window").width / 1.4, // Adjust as per your layout
  },
  fullWidthImage: {
    width: Dimensions.get("window").width - 20, // Full width minus margins
    height: (Dimensions.get("window").width - 30) * 0.6, // Maintain aspect ratio
    borderRadius: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  landscapeImage: {
    width: 800,
    transform: [{ rotate: "90deg" }],
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Gallery;
