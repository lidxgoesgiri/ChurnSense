import type { ProjectInput } from '@/types';

/** Required CSV column headers (snake_case), in canonical order. */
const REQUIRED_HEADERS = [
  'project_name',
  'total_users',
  'active_users',
  'churned_users',
  'monthly_revenue',
] as const;

/** Maps a snake_case CSV header to its camelCase ProjectInput field. */
const HEADER_TO_FIELD: Record<string, keyof ProjectInput> = {
  project_name: 'projectName',
  total_users: 'totalUsers',
  active_users: 'activeUsers',
  churned_users: 'churnedUsers',
  monthly_revenue: 'monthlyRevenue',
};

const NUMERIC_FIELDS: ReadonlySet<keyof ProjectInput> = new Set([
  'totalUsers',
  'activeUsers',
  'churnedUsers',
  'monthlyRevenue',
]);

/** Thrown when the CSV structure (header row) is malformed. */
export class CsvFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CsvFormatError';
  }
}

/** Pick the separator (`,` or `;`) that appears more often in the header line. */
export function detectSeparator(headerLine: string): string {
  const commas = (headerLine.match(/,/g) ?? []).length;
  const semicolons = (headerLine.match(/;/g) ?? []).length;
  return semicolons > commas ? ';' : ',';
}

/**
 * Split one CSV line on `sep`, honoring double-quoted fields so a separator
 * inside quotes (e.g. `"Acme, Inc."`) is not treated as a delimiter. `""`
 * inside a quoted field is an escaped quote. Handles the common Excel export.
 *
 * Exported so the frontend preview can split rows with the SAME rules the
 * server uses, eliminating preview/parse divergence (#6.2).
 */
export function splitCsvLine(line: string, sep: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++; // consume the escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === sep) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Tokenize a full CSV document into records, honoring quoted fields that span
 * multiple physical lines (#7.6). A newline inside quotes is part of the field,
 * not a record boundary — so spreadsheet exports with embedded line breaks
 * parse correctly. Returns an array of records, each an array of raw cell
 * strings (untrimmed here; callers trim as needed).
 */
export function parseCsvRecords(text: string, sep: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let current = '';
  let inQuotes = false;
  let sawField = false; // whether the current record has any content yet

  const pushField = () => {
    record.push(current.trim());
    current = '';
  };
  const pushRecord = () => {
    pushField();
    records.push(record);
    record = [];
    sawField = false;
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
      sawField = true;
    } else if (char === '"') {
      inQuotes = true;
      sawField = true;
    } else if (char === sep) {
      pushField();
      sawField = true;
    } else if (char === '\r') {
      // Swallow CR; the following LF (or end) terminates the record.
      if (text[i + 1] !== '\n' && (sawField || current !== '')) pushRecord();
    } else if (char === '\n') {
      if (sawField || current !== '') pushRecord();
    } else {
      current += char;
      sawField = true;
    }
  }
  // Flush a trailing record with no terminating newline.
  if (sawField || current !== '') pushRecord();
  return records;
}

/**
 * Parse a CSV string into raw row objects keyed by the camelCase ProjectInput
 * fields. Numeric columns are coerced with Number() — invalid values become NaN,
 * which the downstream Zod schema (projectInputSchema) rejects, so parsing stays
 * lenient and validation stays strict.
 *
 * Handles a UTF-8 BOM and auto-detects `,` / `;` separators. Extra/unknown
 * columns are ignored. Throws CsvFormatError when a required header is missing.
 */
export function parseCSV(input: string): Record<string, unknown>[] {
  // Strip a leading UTF-8 BOM if present.
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;

  // Detect the separator from the first physical line, then tokenize the whole
  // document with quote-aware, multiline-aware parsing (#7.6).
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const separator = detectSeparator(firstLine);
  const records = parseCsvRecords(text, separator).filter(
    (r) => r.length > 0 && r.some((c) => c !== '')
  );

  if (records.length === 0) return [];

  const headers = records[0].map((h) => h.toLowerCase());

  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    throw new CsvFormatError(
      `Missing required column(s): ${missing.join(', ')}. Expected header: ${REQUIRED_HEADERS.join(',')}`
    );
  }

  const rows: Record<string, unknown>[] = [];
  for (let i = 1; i < records.length; i++) {
    const cells = records[i];
    const row: Record<string, unknown> = {};
    headers.forEach((header, idx) => {
      const field = HEADER_TO_FIELD[header];
      if (!field) return; // ignore unknown columns
      const raw = cells[idx] ?? '';
      row[field] = NUMERIC_FIELDS.has(field) ? (raw === '' ? NaN : Number(raw)) : raw;
    });
    rows.push(row);
  }
  return rows;
}
