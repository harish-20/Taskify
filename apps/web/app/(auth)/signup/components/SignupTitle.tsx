import Title from "@/components/UI/Title";
import Link from "next/link";

const SignupTitle = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Title className="text-center" order={1}>
        Get started with Taskify
      </Title>

      <div className="text-sm text-gray-600">
        Do you have an account?{" "}
        <Link className="text-primary" href="/signin">
          Sign in
        </Link>
      </div>
    </div>
  );
};
export default SignupTitle;
