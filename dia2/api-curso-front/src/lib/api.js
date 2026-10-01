import { clearSession, getToken } from './auth';

// Todas as chamadas vão para /api/... no mesmo domínio do front.
// O Nginx (produção) ou o rewrite do Next (desenvolvimento) encaminha para a API.
const BASE = '/api';

export class SessionExpiredError extends Error {}

/**
 * Chama a API e devolve o corpo { type, message, data, token? }.
 * A API responde 200 com type: 'error' para erros de validação;
 * 401 significa token ausente ou expirado.
 */
export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    return { type: 'error', message: 'Sem conexão com o servidor. Confira sua internet e tente de novo.' };
  }

  if (response.status === 401) {
    clearSession();
    throw new SessionExpiredError('Sua sessão expirou. Entre de novo.');
  }

  try {
    return await response.json();
  } catch {
    return { type: 'error', message: `O servidor respondeu com erro ${response.status}. Tente de novo em instantes.` };
  }
}
