import { getUserData } from "@/lib/user";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// NOTE: You should adjust this to match your actual user data structure.
interface User {
  id: string;
  email: string;
  name: string;
  phone_number?: string;
  created_at: string; // Assuming this is a date string
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await getUserData();
        console.log(userData);
        setUser(userData);
      } catch (err) {
        console.error("[UserContext] Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const value = { user, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook for easy usage
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
