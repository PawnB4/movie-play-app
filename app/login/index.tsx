import { StyleSheet, Text, View, Image } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { useLogin } from "@/api/auth.api";

export default function Login() {
  const { saveSession, session, clearSession } = useAuth();
  const [error, setError] = useState();
  const { mutateAsync: loginUser, data } = useLogin();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "WEB_CLIENT_ID",
    });
  }, []);

  const handleLogIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const authResponse = await GoogleSignin.signIn();
      const payload = {
        googleToken: authResponse.idToken,
        userInfo: {
          googleToken: authResponse.idToken,
          givenName: authResponse.user.givenName,
          familyName: authResponse.user.familyName,
          email: authResponse.user.email,
          photo: authResponse.user.photo,
        },
      };

      const userTokens = await loginUser(payload);
      await saveSession(userTokens);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  if (session) {
    return <Redirect href={"/"} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>MOVIE PLAY</Text>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 100,
        }}
      >
        <Image
          source={require("../../assets/images/movie_play_icon.png")}
          style={styles.profileImage}
        />
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleLogIn}
        />
      </View>
      <View></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131A22",
    alignItems: "center",
    gap: 30,
    justifyContent: "space-around",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  header: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
});
