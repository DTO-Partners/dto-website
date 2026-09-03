import * as React from "react"
import { cn } from "@/lib/cn"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-[#daa520]/30 bg-[#fdf6e3] px-3 py-2 text-sm ring-offset-[#fdf6e3] placeholder:text-[#1a1a2e]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15162c] focus-visible:border-[#15162c] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
