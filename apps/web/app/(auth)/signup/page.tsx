import ShortLogo from "@/components/logos/ShortLogo";
import SignupTitle from "./components/SignupTitle";
import SocialMediaLogin from "@/components/auth/SocialMediaLogin";
import SignupForm from "./components/SignupForm";
import FooterText from "@/components/auth/FooterText";

const RegisterPage = () => {
  return (
    <div className="mt-3 flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="p-10 min-w-[450px] flex flex-col gap-3 justify-center items-center rounded-lg border border-gray shadow-sm">
        <ShortLogo className="h-16" />

        <SignupTitle />

        <SocialMediaLogin />

        <SignupForm />
      </div>
      <FooterText />
    </div>
  );
};
export default RegisterPage;
