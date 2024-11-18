import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Network from "expo-network";
import { router } from "expo-router";

const NetworkContext = createContext({});

const NetworkProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(true);
  const [previousIsConnected, setPreviousIsConnected] = useState(true);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const { isInternetReachable } = await Network.getNetworkStateAsync();
      if (previousIsConnected && !isInternetReachable) {
        router.replace("/network-error");
      }
      setIsConnected(isInternetReachable);
      setPreviousIsConnected(isInternetReachable);
    };

    checkNetworkStatus();

    const intervalId = setInterval(checkNetworkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [previousIsConnected]);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;

export const useNetworkStatus = () => useContext(NetworkContext);
