import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";

type Session = {
  accessToken: string;
  refreshToken: string;
};

type AuthData = {
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
});

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getValueFor = async (key) => {
      let result = await SecureStore.getItemAsync(key);
      if (result) {
        setSession(JSON.parse(result));
      }
      setLoading(false);
    };
    getValueFor("user_session");
  }, []);

  const saveSession = async (sessionData) => {
    await SecureStore.setItemAsync("user_session", JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const clearSession = async () => {
    await SecureStore.deleteItemAsync("user_session");
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, loading, saveSession, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
