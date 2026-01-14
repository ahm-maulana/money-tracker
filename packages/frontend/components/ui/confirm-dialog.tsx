import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

type ConfirmDialogProps = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
};

function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 focus:ring-red-600";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-600";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 focus:ring-blue-600";
      default:
        return "bg-red-600 hover:bg-red-700 focus:ring-red-600";
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(getConfirmButtonClass(), "cursor-pointer")}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default ConfirmDialog;
