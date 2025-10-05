import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuthStore } from "@/lib/providers/auth-store-provider";

import TextInput from "@/components/UI/TextInput";
import Button from "@/components/UI/Button";

import SigninSchema, { SigninType } from "../schemas/SigninSchema";
import { useEffect } from "react";
import FadeIn from "@/components/animations/FadeIn";

const SigninForm = () => {
  const isSigningIn = useAuthStore((state) => state.isSigningIn);
  const error = useAuthStore((state) => state.signinError);
  const signinWithEmail = useAuthStore((state) => state.signinWithEmail);
  const accessToken = useAuthStore((state) => state.accessToken);

  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [accessToken]);

  const {
    register,
    formState: { errors },
    handleSubmit: formSubmit,
  } = useForm({
    resolver: zodResolver(SigninSchema),
  });

  const handleSubmit: SubmitHandler<SigninType> = (data) => {
    signinWithEmail(data.email, data.password);
  };

  return (
    <FadeIn className="w-full" startDelay={0.2}>
      <form
        className="flex flex-col w-full gap-3"
        onSubmit={formSubmit(handleSubmit)}
      >
        {error && <p>{error}</p>}
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

        <Button className="mt-3" loading={isSigningIn}>
          Sign in
        </Button>
      </form>
    </FadeIn>
  );
};
export default SigninForm;
