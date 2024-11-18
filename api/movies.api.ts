import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useAxiosInstance } from "./axios";

export const useGetMovieById = (id: number) => {
  const axiosInstance = useAxiosInstance();
  return useQuery({
    queryKey: ["movies", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/movies/${id}`);
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    retry: 3,
  });
};

export const useSearchMovie = (
  searchString: string,
  sortBy: string,
  order: string
) => {
  const axiosInstance = useAxiosInstance();
  return useInfiniteQuery({
    queryKey: ["movies", searchString, sortBy, order],
    queryFn: async ({ pageParam = 0 }) => {
      if (searchString === "") throw new Error();
      const res = await axiosInstance.get(`/movies/search`, {
        params: {
          limit: 10,
          offset: pageParam,
          searchString,
          sortBy,
          order,
        },
      });
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    retry: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10; // Return the next offset
      } else {
        return undefined; // No more pages to fetch
      }
    },
    initialPageParam: 0,
  });
};

export const useMovieList = (genre: string | null) => {
  const axiosInstance = useAxiosInstance();
  return useInfiniteQuery({
    queryKey: ["movies", genre],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosInstance.get("/movies", {
        params: {
          limit: 10,
          offset: pageParam,
          genre, // Include genre in the query parameters
        },
      });
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    retry: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 10) {
        return allPages.length * 10; // Return the next offset
      } else {
        return undefined; // No more pages to fetch
      }
    },
    initialPageParam: 0,
  });
};
