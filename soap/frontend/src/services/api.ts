import axios from 'axios';
export const api = axios.create({ baseURL: '/api', timeout: 95000 });
export function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error))
    return typeof error.response?.data?.detail === 'string'
      ? error.response.data.detail
      : 'Não foi possível carregar os dados. Verifique se o backend está em execução e tente novamente.';
  return 'Não foi possível concluir a consulta.';
}
