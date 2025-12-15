import React from "react";
import { Button } from "./UI";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDialog: React.FC<DialogProps> = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[99999]">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
        <h2 className="text-base font-medium text-slate-700 dark:text-slate-300">
          Do you really want to delete this entry?
        </h2>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
