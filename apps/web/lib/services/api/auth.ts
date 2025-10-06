import { ApiResponse } from "@repo/shared/types";

import Api from ".";
import pathMap from "./pathMap";
import { User } from "@/lib/types";

interface SigninResponse {
  user: User;
  accessToken: string;
}

interface SignupResponse {
  id: string;
  name: string;
  email: string;
}

export const signin = async (email: string, password: string) => {
  const response = await Api.post<ApiResponse<SigninResponse>>(
    pathMap.auth.signin,
    { email, password }
  );

  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await Api.post<ApiResponse<SignupResponse>>(
    pathMap.auth.signup,
    { name, email, password }
  );

  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await Api.post<ApiResponse<SigninResponse>>(
    pathMap.auth.verifyToken,
    { token }
  );

  return response.data;
};
