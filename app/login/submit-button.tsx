"use client";

import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Loader2 } from "lucide-react";

type Props = ComponentProps<"button"> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText,
  className = "",
  ...props
}: Props) {
  const { pending, action } = useFormStatus();
  const isPending = pending && action === props.formAction;

  return (
    <button
      {...props}
      type="submit"
      disabled={isPending}
      className={`${className} relative flex items-center justify-center`}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? pendingText : children}
    </button>
  );
}
