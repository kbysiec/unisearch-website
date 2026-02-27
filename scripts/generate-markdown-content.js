const fs = require('fs');
const path = require('path');

const docsDir = path.join(process.cwd(), 'docs', 'landing-page');
const outputFile = path.join(process.cwd(), 'src', 'content', 'free-pro-markdown.ts');

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.md'));

let content = `// This file is auto-generated. Do not edit manually.
// Run: npm run generate-markdown-content to regenerate.

export const freeProMarkdownContent: Record<string, string> = {\n`;

files.forEach(file => {
  const locale = file.replace('.md', '');
  const markdown = fs.readFileSync(path.join(docsDir, file), 'utf-8');
  const escaped = markdown.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
  content += `  '${locale}': \`${escaped}\`,\n`;
});

content += '};\n';

fs.writeFileSync(outputFile, content, 'utf-8');
console.log(`Generated ${outputFile} with ${files.length} locales`);
