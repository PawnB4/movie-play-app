import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useGetUserProfile, useSetUserNickname } from "@/api/auth.api";
import { Image } from "expo-image";
import LogoutModal from "@/components/LogoutModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { useDeleteUser } from "@/api/auth.api";
import * as ImagePicker from "expo-image-picker";
import { useUploadProfileImage } from "@/api/uploads.api";
import { ImageUp } from "lucide-react-native";

const Profile = () => {
  const [modalVisibleLogout, setModalVisibleLogout] = useState(false);
  const [modalVisibleDeleteAccount, setModalVisibleDeleteAccount] =
    useState(false);
  const [message, setMessage] = useState("");
  const [nicknameTyped, setNicknameTyped] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [isNicknameInputFocused, setIsNicknameInputFocused] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [currentAction, setCurrentAction] = useState(null);
  const [error, setError] = useState("");

  const { data: userInfo, isLoading, refetch } = useGetUserProfile();
  const { mutate: updateUserNickName } = useSetUserNickname();
  const { mutate: deleteUser } = useDeleteUser();
  const { mutateAsync: uploadProfileImage } = useUploadProfileImage();
  const { session } = useAuth();

  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname);
      setNicknameTyped(userInfo.nickname);
    }
  }, [userInfo, nickname]);

  useEffect(() => {
    if (isDismissed) setIsNicknameInputFocused(!isNicknameInputFocused);
  }, [isDismissed]);

  const handleAcceptChanges = async () => {
    const trimmedNickname = nicknameTyped.trim();
    if (!trimmedNickname || trimmedNickname === userInfo.nickname) {
      if (trimmedNickname === userInfo.nickname) {
        setError("No changes detected.");
      }
      if (!trimmedNickname) {
        setError("Nickname cannot be empty.");
      }
    } else {
      setError("");
      handleIsDismissed();
      updateUserNickName({ nickName: trimmedNickname });
      setIsNicknameInputFocused(false);
    }
  };

  const handleLogout = () => {
    setModalVisibleLogout(false);
    router.replace("/logout");
  };

  const handleDeleteAccount = async () => {
    try {
      deleteUser();
      handleLogout();
      setNicknameTyped("");
    } catch (error) {
      console.error("Failed to delete user: ", error);
    }
  };

  const handleCancel = () => {
    if (currentAction === "saveChanges") {
      setNicknameTyped(userInfo.nickname);
    }
    setCurrentAction(null);
    setModalVisibleLogout(false);
    setModalVisibleDeleteAccount(false);
    setMessage("");
    setError(""); // Clear any error messages
  };

  const handleIsDismissed = () => {
    setIsDismissed(true);
    Keyboard.dismiss();
  };

  const pickImage = async () => {
    console.log("Starting image pick process");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUploading(true);
      console.log("Image picked:", result.assets[0]);
      const imageUri = result.assets[0].uri;
      const fileSize = result.assets[0].fileSize;
      if (fileSize > 8388608) {
        alert("File size too large. Please select an image smaller than 8MB.");
        return;
      }
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: result.assets[0].fileName || "profile.jpg", // Provide a default name
        type: result.assets[0].mimeType || "image/jpeg", // Provide a default type
      });
      console.log("FormData created:", formData);
      try {
        await uploadProfileImage(formData);
        await refetch();
        setImageUploading(false);
      } catch (error) {
        setImageUploading(false);
      }
    } else {
      console.log("Image picking cancelled");
    }
  };

  if (!session) {
    return <Redirect href={"/logout"} />;
  }

  if (isLoading || !userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CAC4D0" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#131A22" }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <View style={{ position: "relative", width: 200, height: 200 }}>
            {imageUploading && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 9999,
                }}
              >
                <ActivityIndicator size="large" color="#E6DFC5" />
              </View>
            )}

            <Image
              source={{ uri: userInfo.profileimage }}
              style={[
                styles.profileImage,
                imageUploading && styles.imageUploading,
              ]}
            />
          </View>
          <Pressable
            onPress={pickImage}
            style={{
              padding: 6,
              display: "flex",
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#86828C",
              borderRadius: 6,
            }}
          >
            <ImageUp size={22} color={"#CAC4D0"} />
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#CAC4D0" }}>
              Update profile picture
            </Text>
          </Pressable>
        </View>
        <View style={styles.infoContainer}>
          <View>
            <Text style={styles.labels}>Nickname</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={setNicknameTyped}
              value={nicknameTyped}
              placeholder={"Set your nick name"}
              placeholderTextColor="#CAC4D0"
              onFocus={() => {
                setIsNicknameInputFocused(true);
              }}
              onBlur={() => setIsNicknameInputFocused(false)}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          {isNicknameInputFocused && (
            <View style={styles.buttonContainer}>
              <Pressable
                style={[styles.saveButton, styles.halfButton]}
                onPress={() => handleAcceptChanges()}
              >
                <Text style={styles.buttonText}>Save changes</Text>
              </Pressable>
              <Pressable
                style={[styles.cancelButton, styles.halfButton]}
                onPress={() => {
                  setCurrentAction("saveChanges");
                  handleCancel();
                  handleIsDismissed();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          )}
          <View>
            <Text style={styles.labels}>Fullname</Text>
            <Text style={styles.userInfoText}>
              {userInfo.firstname} {userInfo.lastname}
            </Text>
          </View>
          <View>
            <Text style={styles.labels}>Email</Text>
            <Text style={styles.userInfoText}>{userInfo.email}</Text>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => {
              setMessage("Do you confirm the deletion of your account?");
              setCurrentAction("deleteAccount");
              setModalVisibleDeleteAccount(true);
            }}
          >
            <Text style={styles.buttonText}>Delete account</Text>
          </Pressable>
          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              setMessage("Do you want to logout?");
              setCurrentAction("logout");
              setModalVisibleLogout(true);
            }}
          >
            <Text style={styles.buttonText}>Log out</Text>
          </Pressable>
        </View>

        <LogoutModal
          modalVisible={modalVisibleLogout}
          setModalVisible={setModalVisibleLogout}
          text={message}
          onAccept={handleLogout}
          onCancel={handleCancel}
        />
        <DeleteAccountModal
          modalVisible={modalVisibleDeleteAccount}
          setModalVisible={setModalVisibleDeleteAccount}
          text={message}
          onAccept={handleDeleteAccount}
          onCancel={handleCancel}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131A22",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
  },
  labels: {
    color: "#CAC4D0",
    fontSize: 14,
    fontWeight: "ultralight",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#131A22",
  },
  infoContainer: {
    width: "100%",
    padding: 50,
    gap: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#CAC4D0",
  },
  imageUploading: {
    opacity: 0.5, // Adjust the opacity value as needed
  },
  userInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    color: "#CAC4D0",
  },
  textInput: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "#CAC4D0",
    color: "#CAC4D0",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#4EFCA5",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#CAC4D0",
  },
  halfButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#FC4E4D",
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: "#E6DFC5",
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 18,
    fontWeight: "700",
    letterSpacing: 0.25,
    color: "black",
  },
});

export default Profile;
