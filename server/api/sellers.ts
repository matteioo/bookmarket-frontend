import type { FetchOptions } from '~/interfaces/FetchOptions';

export default defineEventHandler(async (event) => {
  if (!process.env.NUXT_API_BASE_URL) throw new Error('NUXT_API_BASE_URL is not set');

  const baseUrl = process.env.NUXT_API_BASE_URL;
  const requestParams = getRequestURL(event).search ?? '';
  const apiUrl = `${baseUrl}/sellers${requestParams}`;

  const fetchOptions: FetchOptions = {
    method: String(event.method),
    headers: {
      'Authorization': event.headers.get('Authorization') ?? '',
    },
  };

  if (event.method !== 'GET') {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = JSON.stringify(await readBody(event));
  }

  try {
    const response = await fetch(apiUrl, fetchOptions);
    return response;
  } catch (error) {
    console.error('error', error);
  }
});