import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const Modal = ({ open, onClickOutside, children }) => {
  const [isOpen, setIsOpen] = useState(open);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        isOpen && onClickOutside();
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [modalRef.current, isOpen]);

  useEffect(() => {
    setIsOpen(open);
  }, [open, onClickOutside]);

  const modal = (
    <div>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal cursor-pointer">
        <div
          className="modal-box relative bg-gray-600 w-auto p-9"
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.getElementById("modal")!);
};
