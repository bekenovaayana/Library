"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ru } from "@/shared/i18n";
import { Input, type InputProps } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export type PasswordInputProps = Omit<InputProps, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, disabled, id, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const toggleId = id ? `${id}-visibility-toggle` : undefined;

    return (
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          type={visible ? "text" : "password"}
          className={cn("pr-10", className)}
          disabled={disabled}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          id={toggleId}
          className="absolute right-0 top-0 h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={visible ? ru.auth.hidePassword : ru.auth.showPassword}
          aria-pressed={visible}
          aria-controls={id}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </Button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
