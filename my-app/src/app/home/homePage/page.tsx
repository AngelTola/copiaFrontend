import { Suspense } from 'react';
import Home from './HomePage'; // o './Home' si ese es el que tiene useSearchParams

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando página...</div>}>
      <Home />
    </Suspense>
  );
}