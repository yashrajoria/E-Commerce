import { getUserData, logoutUser, checkAuthStatus } from "@/lib/user";
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
  isAuthenticated: boolean;
  refetchUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    try {
      // First check authentication status
      const authStatus = await checkAuthStatus();

      if (authStatus.authenticated) {
        // If authenticated, fetch full user data
        const userData: User = await getUserData();
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data in localStorage for axios interceptor to use
        if (typeof window !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      } else {
        // Not authenticated
        setUser(null);
        setIsAuthenticated(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('userData');
        }
      }
    } catch (err) {
      console.error("[UserContext] Failed to fetch user:", err);
      // If any error occurs, treat as not authenticated
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
    } finally {
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
      // Always clear the frontend state and localStorage
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // On initial application load, fetch the user
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle forced logouts from Axios interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      console.log("[UserContext] Forced logout event received.");
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData');
      }
    };

    window.addEventListener("logout", handleForcedLogout);

    return () => {
      window.removeEventListener("logout", handleForcedLogout);
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    refetchUser: fetchUser,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
