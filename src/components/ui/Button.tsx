import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-bronze disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-earth text-cream hover:bg-[#2A221E] hover:shadow-md": variant === "primary", // Darker earth on hover
            "border border-bronze bg-transparent text-ink hover:bg-bronze hover:text-cream": variant === "secondary",
            "hover:bg-stone/80 text-ink": variant === "ghost",
            "text-earth underline-offset-4 hover:underline": variant === "link",
            "h-10 px-[24px] py-[14px]": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-12 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
