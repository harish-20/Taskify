import { PropsWithChildren } from "react";

import Error from "../icons/Error";

interface ErrorTextProps extends PropsWithChildren {
  className?: string;
}

const ErrorText: React.FC<ErrorTextProps> = (props) => {
  const { className = "", children } = props;

  return (
    <div
      className={`flex gap-2 items-center justify-center border-2 border-red-400 rounded-md p-2 text-red-500 text-sm bg-red-50 ${className}`}
    >
      <Error className="h-5 w-5" animate={{ pathLength: [0, 1] }} />
      {children}
    </div>
  );
};
export default ErrorText;
