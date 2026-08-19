import { ApiResponse } from '@repo/shared/types';

import pathMap from './pathMap';

import Api from '.';

import { User } from '@/lib/types';

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
  const response = await Api.post<ApiResponse<SigninResponse>>(pathMap.auth.signin, {
    email,
    password,
  });

  return response.data;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await Api.post<ApiResponse<SignupResponse>>(pathMap.auth.signup, {
    name,
    email,
    password,
  });

  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await Api.post<ApiResponse<SigninResponse>>(pathMap.auth.verifyToken, { token });

  return response.data;
};

export const getMe = async () => {
  const response = await Api.get<ApiResponse<User>>(pathMap.auth.me);
  return response.data;
};
