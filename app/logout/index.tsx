import { ActivityIndicator, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRef, useCallback } from "react";
import { Redirect, useFocusEffect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

export default function Logout() {
  const { clearSession, session } = useAuth();
  const isLoggingOut = useRef(false);

  const logOut = useCallback(async () => {
    if (isLoggingOut.current) {
      return;
    }

    isLoggingOut.current = true;

    try {
      console.log("Attempting to clear session");
      await clearSession();
      console.log("Session cleared");

      const isSignedIn = await GoogleSignin.isSignedIn();
      console.log("Is user signed in?", isSignedIn);
      if (isSignedIn) {
        console.log("Revoking access and signing out");
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } else {
        console.log("User is not signed in, skipping revoke and sign out");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      isLoggingOut.current = false;
    }
  }, [clearSession]);

  useFocusEffect(
    useCallback(() => {
      GoogleSignin.configure({
        webClientId:
          "WEB_CLIENT_ID",
      });
      logOut();
    }, [logOut])
  );

  if (!session) {
    return <Redirect href={"/login"} />;
  }

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
