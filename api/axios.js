import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";

// production
const baseURL = "PRODUCTION_API_URL";

export const useAxiosInstance = () => {
  const { session, saveSession, clearSession } = useAuth();
  // Create an Axios instance
  const client = axios.create({
    baseURL: `${baseURL}/api`,
    withCredentials: true,
  });

  // Request interceptor to add the access token to each request
  client.interceptors.request.use(
    (config) => {
      if (session && session.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token refresh logic

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // Check for a specific status and error code indicating token issues
      if (
        error.response.status === 401 &&
        error.response.data &&
        error.response.data.code === "TOKEN_INVALID" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          // Attempt to refresh the token
          const refreshResponse = await axios.post(
            `${baseURL}/api/auth/refresh-token`,
            {
              refreshToken: session.refreshToken,
              accessToken: session.accessToken,
            }
          );

          // Save the new access token
          console.log("Refreshing token");

          await saveSession({
            accessToken: refreshResponse.data.accessToken,
            refreshToken: refreshResponse.data.refreshToken,
          });

          // Return a resolved promise to avoid retrying the original request
          // return Promise.resolve();
          return Promise.reject(error);
        } catch (refreshError) {
          // If token refresh fails, handle appropriately (e.g., logout)
          console.error(
            "Token refresh failed, refresh token has expired, redirecting to login"
          );
          router.replace("/logout");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};
