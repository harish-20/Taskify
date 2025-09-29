import { FC, PropsWithChildren } from "react";

import AuthHeader from "@/components/auth/AuthHeader";

const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AuthHeader />
      {children}
    </>
  );
};
export default AuthLayout;
