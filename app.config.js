export default {
  expo: {
    name: "Movie Play",
    slug: "movie-play-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#131A22",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.dai.movie",
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#E3DFC8",
      },
      package: "com.dai.movie",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "@react-native-google-signin/google-signin",
      "expo-secure-store",
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "83d978bb-e868-40ab-aad9-fbfdc01dae60",
      },
    },
  },
};
