//libs/verificacionDosPasos/verify2FACode.ts
export const verify2FACode = async (codigo: string) => {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:3001/api/2fa/verificar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ codigo }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Error al verificar el código');
  }

  return data;
};