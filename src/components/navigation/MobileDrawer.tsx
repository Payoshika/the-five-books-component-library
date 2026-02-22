import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const MobileDrawer = ({
  isOpen,
  onClose,
  children,
}: MobileDrawerProps) => {
  // 1. 背景スクロールのロック
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 背景のオーバーレイ (Backdrop) */}
      <div
        className={twMerge(
          "fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 backdrop-blur-sm",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={onClose}
      />

      {/* ドロワー本体 (Slide Panel) */}
      <aside
        className={twMerge(
          "fixed top-0 right-0 z-[70] h-full w-[280px] bg-ui-bg p-6 shadow-2xl transition-transform duration-300 ease-in-out border-l border-ui-border",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* 閉じるボタン */}
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-ui-secondary hover:text-ui-primary"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* メニュー内容 */}
          <nav className="flex flex-col gap-6">{children}</nav>
        </div>
      </aside>
    </>
  );
};
