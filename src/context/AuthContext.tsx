import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {User, AuthContextProps} from '../types/index'

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const BASE_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData: User, token: string) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const refreshUser = async (): Promise<User | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to refresh user data");

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, refreshUser, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
