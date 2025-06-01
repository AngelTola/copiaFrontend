//libs/verificacionDosPasos/send2FACode.ts
export const send2FACode = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3001/api/2fa/enviar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error al enviar código 2FA');
  }

  return res.json();
};