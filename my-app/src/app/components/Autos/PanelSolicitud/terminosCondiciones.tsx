'use client';

import Link from 'next/link';

interface TerminosCondicionesProps {
    onAceptarTerminos: (aceptado: boolean) => void;
}

export default function TerminosCondiciones({ onAceptarTerminos }: TerminosCondicionesProps) {
    return (
        <div className="border border-gray-300 rounded-xl p-4">
            <div className="flex items-start space-x-2">
                <input
                    type="checkbox"
                    id="terms"
                    onChange={(e) => onAceptarTerminos(e.target.checked)}
                    className="mt-1 h-4 w-4 text-[#fca311] focus:ring-[#fca311] border-gray-300 rounded"
                />
                <div className="flex-1">
                    <label htmlFor="terms" className="text-sm font-medium text-gray-700">
                        Acepto los términos y condiciones
                    </label>
                    <div className="mt-2 text-base text-gray-600 max-h-[60px] overflow-y-auto sm:overflow-visible sm:max-h-none">
                        <p>
                            Al aceptar estos{' '}
                            <Link 
                                href="/terminosCondiciones" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                términos y condiciones
                            </Link>, confirmo que he leído y entendido las políticas de alquiler, 
                            incluyendo condiciones de cancelación, requisitos de documentación y responsabilidades.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}