import FullLogo from "@/components/logos/FullLogo";
import Button from "../UI/Button";
import Link from "next/link";

const AuthHeader = () => {
  return (
    <div className="flex justify-between px-8 py-4">
      <FullLogo />

      <div className="flex items-center gap-2">
        <Link href="/explore">
          <Button variant="secondary-dark">Explore Features</Button>
        </Link>
        <Link href="/signin">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
};
export default AuthHeader;
