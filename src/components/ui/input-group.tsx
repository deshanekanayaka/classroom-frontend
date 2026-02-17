import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

// Root input group wrapper
function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative grid", className)}
      {...props}
    />
  );
}

// Addon container (e.g., suffix/prefix block)
function InputGroupAddon({
  align = "block-end",
  className,
  ...props
}: { align?: "inline-end" | "block-end" } & React.ComponentProps<"div">) {
  const position = align === "inline-end" ? "right-0 top-0 bottom-0" : "right-2 bottom-2";
  return (
    <div
      data-slot="input-group-addon"
      className={cn("pointer-events-none absolute flex items-end", position, className)}
      {...props}
    />
  );
}

// Text inside an addon
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="input-group-text"
      className={cn(
        "rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

// A Textarea tailored for usage inside InputGroup
const InputGroupTextarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Textarea>>(
  function InputGroupTextareaInner({ className, ...props }, ref) {
    return (
      <Textarea
        ref={ref}
        className={cn("min-h-24 resize-y pr-20", className)}
        {...props}
      />
    );
  }
);

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea };