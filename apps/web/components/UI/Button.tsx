import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const buttonStyles = cva(
  "inline-flex items-center justify-center font-medium rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-black text-white hover:bg-primary focus:ring-primary",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
        text: "bg-transparent text-blue-600 hover:underline focus:ring-blue-400",
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
};

export default Button;
