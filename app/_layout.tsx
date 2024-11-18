import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import HomeScreenHeader from "@/components/HomeScreenHeader";
import SearchScreenHeader from "@/components/SearchScreenHeader";
import GeneralScreenHeader from "@/components/GeneralScreenHeader";
import SearchProvider from "@/providers/SearchProvider";
import { Stack } from "expo-router";
import NetworkProvider from "@/providers/NetworkProvider";
import FavoriteMovieProvider from "@/providers/FavoriteMovieProvider";
import MovieRateScreenHeader from "@/components/MovieRateScreenHeader";

const RootLayout = () => {
  return (
    <NetworkProvider>
      <AuthProvider>
        <QueryProvider>
          <SearchProvider>
            <FavoriteMovieProvider>
              <Stack>
                <Stack.Screen
                  name="network-error"
                  options={{
                    header: () => <></>,
                  }}
                />
                <Stack.Screen
                  name="login/index"
                  options={{
                    header: () => <></>,
                  }}
                />
                <Stack.Screen
                  name="logout/index"
                  options={{
                    header: () => <></>,
                  }}
                />
                <Stack.Screen
                  name="index"
                  options={{
                    headerTitle: "",
                    headerStyle: {
                      backgroundColor: "#E6DFC5",
                    },
                    header: () => <HomeScreenHeader />,
                  }}
                />
                <Stack.Screen
                  name="search/index"
                  options={{
                    headerTitle: "",
                    headerStyle: {
                      backgroundColor: "#E6DFC5",
                    },
                    header: () => <SearchScreenHeader />,
                    animation: "flip",
                  }}
                />
                <Stack.Screen
                  name="movie-detail/[id]"
                  options={{
                    header: () => null,
                    animation: "slide_from_right",
                  }}
                />
                <Stack.Screen
                  name="movie-rate/[id]/[poster]"
                  options={{
                    header: () => (
                      <MovieRateScreenHeader tabName={"Rate Movie"} />
                    ),
                    animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="movie-gallery/index"
                  options={{
                    header: () => <GeneralScreenHeader tabName={"Gallery"} />,
                  }}
                />
                <Stack.Screen
                  name="profile/index"
                  options={{
                    header: () => <GeneralScreenHeader tabName={"Profile"} />,
                  }}
                />
                <Stack.Screen
                  name="favorites/index"
                  options={{
                    headerTitle: "Favorites",
                    header: () => <GeneralScreenHeader tabName={"Favorites"} />,
                  }}
                />
              </Stack>
            </FavoriteMovieProvider>
          </SearchProvider>
        </QueryProvider>
      </AuthProvider>
    </NetworkProvider>
  );
};

export default RootLayout;
