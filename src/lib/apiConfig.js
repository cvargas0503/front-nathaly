export const API_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '');
const serverUrl = API_URL.replace(/\/api\/v1$/, '');

export function uploadUrl(filePath) {
  if (!filePath) return '';
  return `${serverUrl}/${filePath.replace(/^\//, '')}`;
}
