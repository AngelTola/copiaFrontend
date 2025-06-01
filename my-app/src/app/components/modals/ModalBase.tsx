'use client';
import { ReactNode } from 'react';

export default function BaseModal({
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/20">
      <div className="w-full h-full sm:w-[34rem] sm:h-auto px-20 py-10 bg-[var(--blanco)] sm:rounded-[35px] sm:shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
        {children}
      </div>
    </div>
  );
}