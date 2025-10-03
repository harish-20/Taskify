"use client";

import ShortLogo from "@/components/logos/ShortLogo";
import SigninTitle from "./components/SigninTitle";
import SocialMediaLogin from "../../../components/auth/SocialMediaLogin";
import SigninForm from "./components/SigninForm";
import FooterText from "../../../components/auth/FooterText";

const SigninPage = () => {
  return (
    <div className="mt-3 flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="p-10 min-w-[450px] flex flex-col gap-3 justify-center items-center rounded-lg border border-gray shadow-sm">
        <ShortLogo className="h-16" />

        <SigninTitle />

        <SocialMediaLogin />

        <SigninForm />
      </div>
      <FooterText />
    </div>
  );
};

export default SigninPage;
