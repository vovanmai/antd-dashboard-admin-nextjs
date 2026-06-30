"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCurrentUser } from "@/store/features/auth/authSlice";
import { authApi } from "@/api/auth";
import { setAuthToken } from "@/api/axiosClient";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    setAuthToken(token);
    authApi.getProfile()
      .then((user) => dispatch(setCurrentUser(user)))
      .catch(() => {
        localStorage.removeItem("access_token");
        dispatch(setCurrentUser(null));
      });
  }, [dispatch]);

  return <>{children}</>;
}
