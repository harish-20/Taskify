"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";

import SignupSchema, { SignupType } from "../schemas/SignupSchema";

const SignupForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit: formSubmit,
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const handleSubmit: SubmitHandler<SignupType> = async (data) => {};

  return (
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

      <Button className="mt-3">Sign in</Button>
    </form>
  );
};
export default SignupForm;
