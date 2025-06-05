// /app/home/page.tsx
import { Suspense } from 'react';
import Home from './Home';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Cargando página principal...</div>}>
      <Home />
    </Suspense>
  );
}