
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ResidentRegistrationForm } from "./ResidentRegistrationForm";

interface ResidentRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ResidentRegistrationModal({ 
  open, 
  onOpenChange,
  onSuccess
}: ResidentRegistrationModalProps) {
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
          <DialogTitle>Register New Resident</DialogTitle>
          <DialogDescription>
            Enter the details of the resident to register them in the system.
          </DialogDescription>
        </DialogHeader>
        <ResidentRegistrationForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
