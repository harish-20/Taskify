"use client";

import { useState } from "react";

import TextInput from "@/components/UI/TextInput";
import ShortLogo from "@/components/logos/ShortLogo";
import SigninTitle from "./components/SigninTitle";
import SocialMediaLogin from "./components/SocialMediaLogin";
import SigninForm from "./components/SigninForm";

const SigninPage = () => {
  const [text, setText] = useState("");
  return (
    <div className="mt-3 flex-1 flex items-center justify-center">
      <div className="p-10 min-w-[450px] flex flex-col gap-3 justify-center items-center rounded-lg border border-gray shadow-sm">
        <ShortLogo className="h-16" />

        <SigninTitle />

        <SocialMediaLogin />

        <SigninForm />
      </div>
    </div>
  );
};

export default SigninPage;
