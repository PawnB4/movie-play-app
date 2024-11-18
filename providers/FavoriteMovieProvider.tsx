import {
  useFavoriteMovies,
  useAddFavoriteMovie,
  useDeleteFavoriteMovie,
} from "@/api/favorites.api";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

const FavoriteMovieContext = createContext({});

const FavoriteMovieProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState([]);
  const { session } = useAuth();
  const { refetch } = useFavoriteMovies();
  const { mutate: deleteFavoriteMovie } = useDeleteFavoriteMovie();
  const { mutate: addFavoriteMovie } = useAddFavoriteMovie();

  useEffect(() => {
    if (session) {
      const loadFavorites = async () => {
        const res = await refetch();
        const movie_ids = res.data.map((item) => {
          return item.id;
        });
        console.log(movie_ids);
        setFavorites(movie_ids);
      };
      loadFavorites();
    }
  }, [session]);

  const toggleFavoriteMovie = async (movieId: number) => {
    const checkFavorite = favorites.some((id) => {
      return id == movieId;
    });

    if (checkFavorite) {
      deleteFavoriteMovie(movieId);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((id) => id != movieId)
      );
    } else {
      addFavoriteMovie(movieId);
      setFavorites((prevFavorites) => [...prevFavorites, movieId]);
    }
  };

  return (
    <FavoriteMovieContext.Provider
      value={{ favorites, setFavorites, toggleFavoriteMovie }}
    >
      {children}
    </FavoriteMovieContext.Provider>
  );
};

export default FavoriteMovieProvider;

export const useFavoriteMovieContext = () => useContext(FavoriteMovieContext);
