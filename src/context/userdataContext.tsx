"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";

// --- Types ---
type User = {
  id: string;
  name: string;
  email: string;
  profileimg?: string;
  credits: number;
  provider:string;
  geminimodel?: string | null; // depending on your schema
  geminkey?: string | null;    // depending on your schema
} | null;

type CV = {
  id: string;
  previewText: string;
};

type UserContextType = {
  user: User;
  loading: boolean;
  improvedTexts: CV[];
  refetch: () => void;
};

// --- Context ---
const UserContext = createContext<UserContextType>({
  user: null,
  improvedTexts: [],
  loading: true,
  refetch: () => {},
});

export const useUser = () => useContext(UserContext);

// --- Provider ---
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [improvedTexts, setImprovedTexts] = useState<CV[]>([]);

  const fetchUserAndCVs = async () => {
    setLoading(true);
    try {
      // Assuming you already know the userID somehow (maybe from cookie/session)
      const res = await api.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/resume/chats`,
        { withCredentials: true }
      );
      
      const { user: fetchedUser, improved: cvs } = res.data;

      setUser(fetchedUser ?? null);
      setImprovedTexts(cvs ?? []);
    } catch (err) {
      console.error("Error fetching user and CVs:", err);
      setUser(null);
      setImprovedTexts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndCVs();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        improvedTexts,
        refetch: fetchUserAndCVs,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
