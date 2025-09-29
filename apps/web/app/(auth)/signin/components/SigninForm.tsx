import { FormEventHandler } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";

import SigninSchema, { SigninType } from "../schemas/SigninSchema";
import { infer } from "zod";

const SigninForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit: formSubmit,
  } = useForm({
    resolver: zodResolver(SigninSchema),
  });

  const handleSubmit: SubmitHandler<SigninType> = async (data) => {};

  return (
    <form
      className="flex flex-col w-full gap-3"
      onSubmit={formSubmit(handleSubmit)}
    >
      <TextInput
        label="Email"
        id="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <TextInput
        label="Password"
        type="password"
        id="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button className="mt-3">Sign in</Button>
    </form>
  );
};
export default SigninForm;
