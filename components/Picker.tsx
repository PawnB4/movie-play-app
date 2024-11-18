import React from "react";
import { View, Text, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

const movieCategories = [
  { title: "All" },
  { title: "Horror" },
  { title: "Drama" },
  { title: "Thriller" },
  { title: "Romance" },
  { title: "Mystery" },
  { title: "Adventure" },
  { title: "Action" },
  { title: "Fantasy" },
  { title: "Comedy" },
  { title: "Animation" },
  { title: "Sci-Fi" },
  { title: "Crime" },
  { title: "Western" },
];

const DropdownSelector = ({ onSelectGenre, selectedGenre }) => {
  return (
    <SelectDropdown

      data={movieCategories}
      onSelect={(selectedItem, index) => {
        if (selectedItem.title === "All") {
          onSelectGenre(null);
        } else {
          onSelectGenre(selectedItem.title);
        }
      }}
      renderButton={() => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedGenre || "Pick a genre"}
            </Text>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownButtonStyle: {
    width: 150,
    borderWidth: 1,
    borderColor: "#86828C",
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonTxtStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#CAC4D0",
  },
  dropdownMenuStyle: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
});

export default DropdownSelector;
