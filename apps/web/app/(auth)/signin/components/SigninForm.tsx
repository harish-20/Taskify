import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/lib/providers/auth-store-provider";

import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import FadeIn from "@/components/animations/FadeIn";
import ErrorText from "@/components/UI/ErrorText";

import { customLocalStorage } from "@/lib/services/localStorage";

import SigninSchema, { SigninType } from "../schemas/SigninSchema";

const SigninForm = () => {
  const isSigningIn = useAuthStore((state) => state.isSigningIn);
  const error = useAuthStore((state) => state.signinError);
  const user = useAuthStore((state) => state.user);
  const clearErrors = useAuthStore((state) => state.clearErrors);
  const signinWithEmail = useAuthStore((state) => state.signinWithEmail);

  const router = useRouter();

  useEffect(() => {
    const accessToken = customLocalStorage.getValue("accessToken");
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [user]);

  const {
    register,
    formState: { errors },
    handleSubmit: formSubmit,
  } = useForm({
    resolver: zodResolver(SigninSchema),
  });

  const handleSubmit: SubmitHandler<SigninType> = (data) => {
    clearErrors();
    signinWithEmail(data.email, data.password);
  };

  return (
    <FadeIn className="w-full" startDelay={0.2}>
      <form
        className="flex flex-col w-full gap-3"
        onSubmit={formSubmit(handleSubmit)}
      >
        {error && <ErrorText>{error}</ErrorText>}
        <TextInput
          label="Email"
          id="email"
          placeholder="name@example.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <TextInput
          label="Password"
          type="password"
          id="password"
          placeholder="At least 8 characters"
          {...register("password")}
          error={errors.password?.message}
        />

        <Button className="mt-3" loading={isSigningIn} done={!!user}>
          Sign in
        </Button>
      </form>
    </FadeIn>
  );
};
export default SigninForm;
