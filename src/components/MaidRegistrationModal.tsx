
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MaidRegistrationForm } from "./MaidRegistrationForm";

interface MaidRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MaidRegistrationModal({ 
  open, 
  onOpenChange,
  onSuccess
}: MaidRegistrationModalProps) {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New Domestic Help</DialogTitle>
          <DialogDescription>
            Enter the details of the domestic help personnel to register them in the system.
          </DialogDescription>
        </DialogHeader>
        <MaidRegistrationForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
