"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";
import FadeIn from "@/components/animations/FadeIn";

import { useAuthStore } from "@/lib/providers/auth-store-provider";

import SignupSchema, { SignupType } from "../schemas/SignupSchema";
import ErrorText from "@/components/UI/ErrorText";

const SignupForm = () => {
  const signupWithEmail = useAuthStore((state) => state.signupWithEmail);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const clearErrors = useAuthStore((state) => state.clearErrors);
  const error = useAuthStore((state) => state.signupError);

  const {
    register,
    formState: { errors },
    handleSubmit: formSubmit,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const handleSubmit: SubmitHandler<SignupType> = async (data) => {
    clearErrors();
    signupWithEmail(data.name, data.email, data.password);
  };

  return (
    <FadeIn className="w-full" startDelay={0.2}>
      {error && <ErrorText>{error}</ErrorText>}
      <form
        className="flex flex-col w-full gap-3"
        onSubmit={formSubmit(handleSubmit)}
      >
        <TextInput
          label="Name"
          id="name"
          placeholder="John Doe"
          {...register("name")}
          error={errors.name?.message}
        />
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

        <Button loading={isSigningUp} className="mt-3">
          Sign in
        </Button>
      </form>
    </FadeIn>
  );
};
export default SignupForm;
