
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#9F68F0] to-[#8B5CF6] text-white hover:shadow-[0_0_20px_rgba(159,104,240,0.5)] hover:from-[#9F68F0]/90 hover:to-[#8B5CF6]/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-[0_0_15px_rgba(255,86,86,0.4)]",
        outline:
          "border border-white/20 bg-black/10 backdrop-blur-md text-foreground hover:bg-white/10 hover:border-[#9F68F0]/50 hover:shadow-[0_0_15px_rgba(159,104,240,0.3)]",
        secondary:
          "bg-white/5 backdrop-blur-md border border-white/10 text-foreground hover:bg-white/10 hover:shadow-[0_0_15px_rgba(159,104,240,0.3)]",
        ghost: "hover:bg-white/10 hover:text-accent-foreground",
        link: "text-[#9F68F0] underline-offset-4 hover:underline hover:text-[#8B5CF6]",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(159,104,240,0.4)] transition-all duration-300",
        neon: "relative bg-black/30 backdrop-blur-md border border-[#9F68F0]/50 text-white shadow-[0_0_10px_rgba(159,104,240,0.5)] hover:shadow-[0_0_20px_rgba(159,104,240,0.7)] transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
