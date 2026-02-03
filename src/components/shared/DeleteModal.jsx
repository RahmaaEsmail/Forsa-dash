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

export function DeleteModal({isLoading , isSuccess , open, setOpen, title, desc = "Are you sure you want to delete this item? This action cannot be undone.", onDelete }) {
   
  useEffect(() => {
    if(isSuccess) {
      setOpen(false)
    }
  } , [isSuccess])

  return (
    <Dialog open={open} onOpenChange={setOpen}> {/* Control dialog visibility */}
    <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={() => setOpen(false)} variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
            variant="default"
            onClick={onDelete}
            type="submit">{isLoading ? "Loading...." :"Delete"}</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
