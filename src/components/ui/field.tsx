import * as React from "react";
import { cn } from "@/lib/utils";

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("grid gap-6", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

type MaybeError = { message?: string | null } | undefined | null;
function FieldError({
  errors,
  className,
  ...props
}: { errors?: MaybeError[] } & React.ComponentProps<"div">) {
  const messages = (errors ?? [])
    .map((e) => (typeof e?.message === "string" ? e!.message : null))
    .filter(Boolean) as string[];

  if (messages.length === 0) return null;

  return (
    <div
      data-slot="field-error"
      role="alert"
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}

export { Field, FieldGroup, FieldLabel, FieldDescription, FieldError };