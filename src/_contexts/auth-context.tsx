"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type Role = "professor" | "aluno" | "admin";

type BackendRole = "STUDENT" | "TEACHER" | "ADMIN";

type BackendUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: BackendRole;
  studentProfile?: { id: string } | null;
  teacherProfile?: { id: string; status: string } | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  rawRole: BackendRole;
  studentProfile?: { id: string } | null;
  teacherProfile?: { id: string; status: string } | null;
};

type GoogleLoginResponse =
  | {
      user: BackendUser;
      needsOnboarding?: false;
    }
  | {
      needsOnboarding: true;
      profile: {
        email: string;
        name: string;
        picture?: string;
      };
    };

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  loginWithGoogle: (
    idToken: string,
    role?: "STUDENT" | "TEACHER",
  ) => Promise<GoogleLoginResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function mapRole(role: BackendRole): Role {
  switch (role) {
    case "TEACHER":
      return "professor";
    case "ADMIN":
      return "admin";
    case "STUDENT":
    default:
      return "aluno";
  }
}

function normalizeUser(user: BackendUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: mapRole(user.role),
    rawRole: user.role,
    studentProfile: user.studentProfile,
    teacherProfile: user.teacherProfile,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshUser() {
    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      if (data.user) {
        setUser(normalizeUser(data.user));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function loginWithGoogle(
    idToken: string,
    role?: "STUDENT" | "TEACHER",
  ): Promise<GoogleLoginResponse> {
    const response = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        idToken,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao autenticar com Google.");
    }

    if (data.needsOnboarding) {
      setUser(null);
      return data;
    }

    if (data.user) {
      setUser(normalizeUser(data.user));
    }

    return data;
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
