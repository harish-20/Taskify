"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { verifyToken } from "@/lib/services/api/auth";

import Loading from "./components/Loading";
import Failed from "./components/Failed";
import Success from "./components/Success";

type VerificationStatus = "pending" | "success" | "failure";

const VerifyPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("pending");
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) return;
      try {
        const response = await verifyToken(token);

        if (response.success) {
          setVerificationStatus("success");
        } else {
          setVerificationStatus("failure");
        }
      } catch (err) {
        setVerificationStatus("failure");
      }
    };

    handleVerify();
  }, [token]);

  if (verificationStatus === "pending") return <Loading />;

  if (verificationStatus === "failure") return <Failed />;

  if (verificationStatus === "success") return <Success />;
};

export default VerifyPage;
