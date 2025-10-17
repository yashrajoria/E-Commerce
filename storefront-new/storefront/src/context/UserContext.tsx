import { getUserData, logoutUser } from "@/lib/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  phone_number?: string;
  created_at: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refetchUser: () => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Always start in a loading state

  const fetchUser = useCallback(async () => {
    try {
      const userData: User = await getUserData();
      setUser(userData);
    } catch (err) {
      // If fetching the user fails, it means they are not logged in.
      setUser(null);
    } finally {
      // Always stop loading after the first attempt
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      // Call the backend API to clear the HttpOnly cookies
      await logoutUser();
    } catch (error) {
      console.error("[UserContext] Logout API call failed:", error);
    } finally {
      // Always clear the frontend state
      setUser(null);
    }
  }, []);

  // On initial application load, always try to fetch the user.
  // The presence of valid cookies will determine if this succeeds or fails.
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Add an event listener to handle forced logouts from the Axios interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      console.log("Forced logout event received.");
      signOut();
    };

    window.addEventListener("logout", handleForcedLogout);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("logout", handleForcedLogout);
    };
  }, [signOut]);

  const value = { user, loading, refetchUser: fetchUser, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
