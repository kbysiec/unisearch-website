'use client';

import { Check, X } from 'lucide-react';
import type { Messages } from '@/src/lib/i18n';
import { Reveal } from '@/components/motion/reveal';
import { useMemo } from 'react';

interface FreeProProps {
  messages: Messages;
  locale: string;
  markdownContent?: string;
}

interface ComparisonTable {
  category: string;
  rows: {
    feature: string;
    free: string;
    pro: string;
  }[];
}

function parseMarkdownTables(markdown: string): ComparisonTable[] {
  const tables: ComparisonTable[] = [];
  const lines = markdown.split('\n');
  let currentCategory = '';
  let inTable = false;
  let currentRows: ComparisonTable['rows'] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for category header (##)
    if (line.startsWith('## ') && !line.includes('---')) {
      if (currentCategory && currentRows.length > 0) {
        tables.push({ category: currentCategory, rows: currentRows });
        currentRows = [];
      }
      currentCategory = line.replace('## ', '');
      inTable = false;
      continue;
    }

    // Check for table start - all language variations of "Feature"
    const featureWords = ['Feature', 'Funkcja', 'Funktion', 'Fonctionnalité', 'Característica', 'Funzionalità',
      'Functie', 'Funksjon', 'Ominaisuus', 'Funkce', 'Funkcia', 'Funkció', 'Caracteristică',
      'Fitur', 'Recurso', 'Tính', 'Özellik', 'Función', 'Функция', 'सुविधा', 'คุณสมบัติ', '特徴', '機能', '功能', '기능'];

    if (line.startsWith('|') && featureWords.some(word => line.includes(word)) && !inTable) {
      inTable = true;
      i++; // Skip separator line
      continue;
    }

    // Parse table rows
    if (inTable && line.startsWith('|')) {
      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell);

      if (cells.length === 3) {
        currentRows.push({
          feature: cells[0],
          free: cells[1],
          pro: cells[2],
        });
      }
    }

    // End of table
    if (inTable && (!line.startsWith('|') || line === '')) {
      if (currentCategory && currentRows.length > 0) {
        tables.push({ category: currentCategory, rows: currentRows });
        currentRows = [];
      }
      inTable = false;
      currentCategory = '';
    }
  }

  // Add last table if exists
  if (currentCategory && currentRows.length > 0) {
    tables.push({ category: currentCategory, rows: currentRows });
  }

  return tables;
}

export function FreePro({ messages, locale, markdownContent }: FreeProProps) {
  const tables = useMemo(() => {
    if (!markdownContent) return [];
    return parseMarkdownTables(markdownContent);
  }, [markdownContent]);

  function renderCell(value: string) {
    if (value === '✓') {
      return (
        <div className="flex justify-center">
          <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </div>
      );
    }
    if (value === '—') {
      return (
        <div className="flex justify-center">
          <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
        </div>
      );
    }
    return <span className="text-sm text-gray-600 dark:text-slate-300">{value}</span>;
  }

  return (
    <section id="free-pro" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-white sm:text-4xl">
              {messages.freePro.title}
            </h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-slate-300">
              {messages.freePro.subtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-12">
          {tables.map((table, idx) => (
            <Reveal key={table.category} delay={idx * 0.1}>
              <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_50px_-35px_rgba(15,103,190,0.4)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70">
                {/* Category Header */}
                <div className="border-b border-gray-200/50 bg-gradient-to-r from-primary-50/50 to-transparent px-6 py-4 dark:border-white/10 dark:from-primary-500/10">
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                      {idx + 1}
                    </span>
                    {table.category}
                  </h3>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[2fr,1fr,1fr] gap-4 border-b border-gray-200/50 bg-gray-50/50 px-6 py-3 dark:border-white/5 dark:bg-slate-800/30">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    {messages.freePro.featureHeader}
                  </div>
                  <div className="text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Free
                  </div>
                  <div className="text-center text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-300">
                    Pro
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-gray-200/50 dark:divide-white/5">
                  {table.rows.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="grid grid-cols-[2fr,1fr,1fr] gap-4 px-6 py-4 transition hover:bg-primary-50/30 dark:hover:bg-white/5"
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-slate-200">
                        {row.feature}
                      </div>
                      <div className="flex items-center justify-center">{renderCell(row.free)}</div>
                      <div className="flex items-center justify-center">{renderCell(row.pro)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Footer with Pro pricing */}
        <Reveal delay={tables.length * 0.1 + 0.2}>
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Pro: {messages.freePro.pricing}.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

