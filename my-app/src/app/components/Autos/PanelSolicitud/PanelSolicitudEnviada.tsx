import React from "react";

interface PanelSolicitudEnviadaProps {
    mostrar: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const PanelSolicitudEnviada: React.FC<PanelSolicitudEnviadaProps> = ({
    mostrar,
    onClose,
    onConfirm,
}) => {
    if (!mostrar) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[1050]" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-[90%] max-w-[350px] z-[1051]">
                <div className="bg-[#E4D5C1] text-white py-2 px-4 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Solicitud enviada</h2>
                </div>
                <div className="p-4">
                    <p className="text-center py-2 text-gray-800">
                        Su solicitud de reserva ha sido enviada correctamente. Se le notificará cuando el host responda.
                    </p>
                </div>
                <div className="flex gap-4 justify-center pb-4">
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-[#ffa62b] text-white rounded-full font-medium"
                    >
                        ACEPTAR
                    </button>
                </div>
            </div>
        </>
    );
};

export default PanelSolicitudEnviada; 