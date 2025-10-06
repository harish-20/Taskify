import Link from "next/link";

import Title from "@/components/UI/Title";

const SigninTitle = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Title className="text-center" order={1}>
        Sign in to Taskify Now
      </Title>

      <div className="text-sm text-gray-600">
        New to taskify?{" "}
        <Link className="text-primary" href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
};
export default SigninTitle;
