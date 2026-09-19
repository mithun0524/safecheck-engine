export function safeParseUrl(input: string, type: 'url' | 'domain' | 'text'): URL | null {
  if (type === 'text') return null;

  try {
    let toParse = input;
    // For domains without scheme, add it to parse properly
    if (type === 'domain' && !input.includes('://')) {
      toParse = `http://${input}`;
    }
    
    return new URL(toParse);
  } catch {
    return null;
  }
}
