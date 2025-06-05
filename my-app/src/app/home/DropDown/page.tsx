'use client';

import React from 'react';
//import { NotificacionesCampana } from '../componentes/notificacionCampana/NotificacionesCampana';
import { NotificacionesCampana } from '@/app/home/NotificacionesCampana';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <header className="w-full h-[136px] border-[3px] border-[#FCA311] flex justify-end items-center pr-10">
        <NotificacionesCampana />
      </header>
    </div>
  );
}


