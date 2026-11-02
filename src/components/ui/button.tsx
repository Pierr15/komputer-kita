import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5 hover:bg-blue-700",
        secondary: "border border-slate-200 bg-white text-slate-800 hover:border-blue-200 hover:bg-blue-50",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        dark: "bg-slate-950 text-white hover:bg-slate-800",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> & ButtonVariants & {
  children: ReactNode;
};

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants & {
  href: string;
  children: ReactNode;
};

export function ButtonLink({ href, className, variant, size, ...props }: ButtonLinkProps) {
  return <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
