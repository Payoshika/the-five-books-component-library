import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import { useKeyPress } from "../hooks/useKeyPress";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCancel?: boolean;
  onAction?: () => void;
  children: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  showCancel,
  onAction,
  children,
}: ModalProps) => {
  const generatedId = useId();
  const { useEscapeKey } = useKeyPress();

  const [shouldRender, setShouldRender] = useState(isOpen);
  if (isOpen && !shouldRender) {
    setShouldRender(true);
  }

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEscapeKey(onClose);

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target === e.currentTarget && !isOpen) {
      setShouldRender(false);
    }
  };

  if (!isOpen && !shouldRender) return null;

  return createPortal(
    <div
      onClick={onClose}
      onAnimationEnd={handleAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${generatedId}`}
      className={twMerge(
        "fixed inset-0 z-50 p-4 flex justify-center items-center bg-black/40 backdrop-blur-sm",
        isOpen
          ? "motion-opacity-in-0 motion-duration-200"
          : "motion-opacity-out-0 motion-duration-300",
      )}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={twMerge(
          "flex flex-col rounded-lg shadow-xl overflow-hidden",
          "bg-ui-bg text-ui-primary border border-ui-border",
          "w-fit min-w-80 max-w-2xl max-h-[90vh]",
          isOpen
            ? "motion-scale-in-95 motion-opacity-in-0 motion-duration-300"
            : "motion-scale-out-95 motion-opacity-out-0 motion-duration-200",
        )}
      >
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {(showCancel || onAction) && (
          <div className="flex gap-3 p-6 border-t border-ui-border bg-ui-secondary/5">
            {showCancel && (
              <Button className="flex-1" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            {onAction && (
              <Button className="flex-1" variant="primary" onClick={onAction}>
                Action
              </Button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
