/**
 * Creates a simple hash from a string
 * For more security, a proper crypto library should be used in production
 */
export function createHash(str: string): string {
  let hash = 0;
  if (str.length === 0) return hash.toString(16);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string and ensure positive
  return Math.abs(hash).toString(16);
}

/**
 * Compares two hashes
 */
export function compareHashes(hash1: string, hash2: string): boolean {
  return hash1 === hash2;
}
