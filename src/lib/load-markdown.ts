import { readFileSync } from 'fs';
import { join } from 'path';

export async function loadFreeProMarkdown(locale: string): Promise<string> {
  try {
    const filePath = join(process.cwd(), 'docs', 'landing-page', `${locale}.md`);
    return readFileSync(filePath, 'utf-8');
  } catch {
    // Fallback to English
    const filePath = join(process.cwd(), 'docs', 'landing-page', 'en.md');
    return readFileSync(filePath, 'utf-8');
  }
}
