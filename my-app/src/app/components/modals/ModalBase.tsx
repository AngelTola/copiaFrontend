'use client';
import { ReactNode } from 'react';

export default function BaseModal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/20">
      <div className="w-full h-full sm:w-[34rem] sm:h-auto p-10 bg-[var(--blanco)] sm:rounded-[35px] sm:shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
        {children}
      </div>
    </div>
  );
}