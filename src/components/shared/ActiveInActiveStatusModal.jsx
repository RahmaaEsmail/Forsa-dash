import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

export function ActiveInActiveStatusModal({
  isLoading,
  isSuccess,
  open,
  setOpen,
  title,
  desc,
  onSuccess,
}) {
  // Default description, including dynamic part if desc is not passed
  const defaultDesc = desc || `Are you sure you want to ${open?.isActive ? "deactivate" : "activate"} this product? This action cannot be undone.`;

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{defaultDesc}</DialogDescription> {/* Display the default or passed description */}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={onSuccess}
            type="submit"
          >
            {isLoading ? "Loading...." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
