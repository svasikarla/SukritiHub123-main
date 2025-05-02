
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuardRegistrationForm } from "./GuardRegistrationForm";

interface GuardRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GuardRegistrationModal({ 
  open, 
  onOpenChange,
  onSuccess
}: GuardRegistrationModalProps) {
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
          <DialogTitle>Register New Guard</DialogTitle>
          <DialogDescription>
            Enter the details of the security guard to register them in the system.
          </DialogDescription>
        </DialogHeader>
        <GuardRegistrationForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
