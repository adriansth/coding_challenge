"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   title?: string;
   children: React.ReactNode;
   size?: "sm" | "md" | "lg" | "xl";
   className?: string;
}

export default function Modal({
   isOpen,
   onClose,
   title,
   children,
   size = "md",
   className = "",
}: ModalProps) {
   // close modal on esc key
   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === "Escape") {
            onClose();
         }
      };
      if (isOpen) {
         document.addEventListener("keydown", handleEscape);
         // prevent body scroll when modal is open
         document.body.style.overflow = "hidden";
      }
      return () => {
         document.removeEventListener("keydown", handleEscape);
         document.body.style.overflow = "unset";
      };
   }, [isOpen, onClose]);

   if (!isOpen) return null;

   const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* backdrop */}
         <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
         >
            {/* modal container */}
            <div
               className={`relative w-full mx-4 bg-white rounded-lg shadow-xl border border-neutral-200 ${sizeClasses[size]} ${className}`}
            >
               {/* header */}
               {title && (
                  <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                     <h2 className="text-xl font-semibold text-neutral-800">
                        {title}
                     </h2>
                     <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-md hover:bg-neutral-100"
                     >
                        <X size={20} />
                     </button>
                  </div>
               )}
               {/* content */}
               <div className="p-5">{children}</div>
            </div>
         </div>
      </div>
   );
}
