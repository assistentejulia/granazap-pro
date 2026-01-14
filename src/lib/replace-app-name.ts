/**
 * Substitui todas as ocorrências de "Assistente Julia" pelo nome da aplicação configurado
 */
export function replaceAppName(text: string, appName: string): string {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/Assistente Julia/g, appName);
}
