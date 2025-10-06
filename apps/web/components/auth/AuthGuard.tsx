"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { customLocalStorage } from "@/lib/services/localStorage";

type AuthMode = "auth" | "unauth";

interface AuthGuardProps {
  mode: AuthMode;
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = (props) => {
  const { mode, children } = props;

  const router = useRouter();

  useEffect(() => {
    const accessToken = customLocalStorage.getValue("accessToken");
    if (mode === "auth") {
      if (!accessToken) {
        router.replace("/signin");
      }
    }
    if (mode === "unauth") {
      if (accessToken) {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
