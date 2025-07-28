export interface Catalog {
  id: number;
  coverUrl: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  synopsis: string;
  publisher: string;
  type: string;
}

export interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

export interface UpdateCatalogProps {
  initialData: Catalog;
  onClose: () => void;
  onSuccess: () => void;
}

export interface WishlistItem {
  id: number;
  coverUrl: string;
  title: string;
  author: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  NIK?: string;
  phone?: string;
  wishlists?: WishlistItem[];
}

export interface AuthContextProps {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CatalogSearchParams {
  keyword?: string;
  genre?: string;
  type?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (value: boolean) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  genres: string[];
  visibleGenres: string[];
  showAllGenres: boolean;
  setShowAllGenres: (value: boolean) => void;
}
