import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        neutral: "bg-[#E2E8F0] text-[#334155]",
        positive: "bg-[#DCFCE7] text-[#166534]",
        negative: "bg-[#FEE2E2] text-[#991B1B]",
        warning: "bg-[#FEF3C7] text-[#92400E]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
