import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

export default function CustomEmptyData({
  title = "No data found",
  description = "Try changing filters or add a new item.",
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  actionVariant = "default",
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-background p-8 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-3">
        {Icon ? (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Icon className="h-7 w-7 text-muted-foreground" />
          </div>
        ) : null}

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {children ? <div className="w-full">{children}</div> : null}

        {actionLabel && typeof onAction === "function" ? (
          <Button
            type="button"
            variant={actionVariant}
            onClick={onAction}
            className="mt-2"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
