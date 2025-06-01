export const login = async (email: string, password: string) => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Error en login');
  }

  const data = await res.json();

  if (data.requiere2FA) {
    return {
      requiere2FA: true,
      userId: data.userId,
      email: data.email,
    };
  }

  // login normal
  return {
    requiere2FA: false,
    token: data.token,
    user: data.user,
  };
};