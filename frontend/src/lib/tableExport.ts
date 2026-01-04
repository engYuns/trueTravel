type Primitive = string | number | boolean | null | undefined;

const INTERNAL_KEYS = new Set(['selected']);

function normalizeCell(value: unknown): Primitive {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.map((v) => (v === null || v === undefined ? '' : String(v))).join(' | ');
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

function normalizeRow(row: Record<string, unknown>): Record<string, Primitive> {
  const out: Record<string, Primitive> = {};
  for (const [k, v] of Object.entries(row)) {
    if (INTERNAL_KEYS.has(k)) continue;
    if (typeof v === 'function') continue;
    out[k] = normalizeCell(v);
  }
  return out;
}

function inferHeaders(rows: Array<Record<string, unknown>>): string[] {
  const first = rows[0];
  if (!first) return [];
  return Object.keys(first).filter((k) => !INTERNAL_KEYS.has(k));
}

function headersToLabels(headers: string[]): string[] {
  return headers.map((h) =>
    h
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
  );
}

export async function exportTableToExcel(
  filename: string,
  rows: Array<Record<string, unknown>>,
  headers?: string[]
): Promise<void> {
  const XLSX = await import('xlsx-js-style/dist/xlsx.bundle.js');
  const safeRows = rows.map(normalizeRow);
  const cols = headers && headers.length ? headers : inferHeaders(safeRows);

  const aoa: Primitive[][] = [];
  aoa.push(headersToLabels(cols));
  for (const r of safeRows) {
    aoa.push(cols.map((c) => r[c] ?? ''));
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const headerFill = 'FF374151';
  const headerFont = 'FFFFFFFF';
  const border = {
    top: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
    bottom: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
    left: { style: 'thin', color: { rgb: 'FFE5E7EB' } },
    right: { style: 'thin', color: { rgb: 'FFE5E7EB' } }
  } as const;

  const ref = ws['!ref'];
  if (ref) {
    const range = XLSX.utils.decode_range(ref);

    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const cell = ws[addr];
        if (!cell) continue;

        if (r === 0) {
          cell.s = {
            font: { bold: true, color: { rgb: headerFont } },
            fill: { patternType: 'solid', fgColor: { rgb: headerFill } },
            alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
            border
          };
        } else {
          const stripe = r % 2 === 0 ? 'FFF9FAFB' : 'FFFFFFFF';
          cell.s = {
            font: { color: { rgb: 'FF111827' } },
            fill: { patternType: 'solid', fgColor: { rgb: stripe } },
            alignment: { vertical: 'center', horizontal: 'left', wrapText: true },
            border
          };
        }
      }
    }

    ws['!autofilter'] = { ref };

    // Auto-size columns (approx) based on content length
    const colWidths = new Array(range.e.c - range.s.c + 1).fill(10);
    for (let c = range.s.c; c <= range.e.c; c++) {
      let max = 10;
      for (let r = range.s.r; r <= range.e.r; r++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        const v = ws[addr]?.v;
        const len = v === null || v === undefined ? 0 : String(v).length;
        max = Math.max(max, Math.min(40, len + 2));
      }
      colWidths[c - range.s.c] = max;
    }
    ws['!cols'] = colWidths.map((wch) => ({ wch }));

    // Freeze header row (best-effort; supported by most SheetJS consumers)
    ws['!sheetViews'] = [
      {
        state: 'frozen',
        ySplit: 1,
        topLeftCell: 'A2',
        activePane: 'bottomLeft'
      }
    ];
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  const data = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  const blob = new Blob([data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportTableToPdf(
  filename: string,
  title: string,
  rows: Array<Record<string, unknown>>,
  headers?: string[]
): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const safeRows = rows.map(normalizeRow);
  const cols = headers && headers.length ? headers : inferHeaders(safeRows);
  const head = [headersToLabels(cols)];
  const body = safeRows.map((r) => cols.map((c) => r[c] ?? ''));

  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  doc.setFontSize(14);
  doc.text(title, 40, 40);

  autoTable(doc, {
    startY: 60,
    head,
    body,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [55, 65, 81] },
    margin: { left: 40, right: 40 }
  });

  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

export async function copyTableToClipboard(
  rows: Array<Record<string, unknown>>,
  headers?: string[]
): Promise<boolean> {
  const safeRows = rows.map(normalizeRow);
  const cols = headers && headers.length ? headers : inferHeaders(safeRows);
  const headerLine = headersToLabels(cols).join('\t');
  const lines = safeRows.map((r) => cols.map((c) => String(r[c] ?? '')).join('\t'));
  const text = [headerLine, ...lines].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function printTable(selector: string, title?: string): void {
  const el = document.querySelector(selector);
  if (!el) {
    console.error(`printTable: element not found for selector: ${selector}`);
    return;
  }

  // Clone and strip action/selection columns (e.g., checkbox + Detail buttons)
  // so printouts include only data columns.
  const cloned = el.cloneNode(true) as HTMLElement;
  for (const table of Array.from(cloned.querySelectorAll('table'))) {
    const headerRow = table.querySelector('thead tr') ?? table.querySelector('tr');
    if (!headerRow) continue;

    const headerCells = Array.from(headerRow.children) as HTMLElement[];
    if (headerCells.length === 0) continue;

    const bodyRows = Array.from(table.querySelectorAll('tbody tr')).slice(0, 5) as HTMLElement[];
    const drop = new Set<number>();

    for (let i = 0; i < headerCells.length; i++) {
      const headerCell = headerCells[i];
      const headerText = (headerCell.textContent ?? '').trim().toLowerCase();
      const headerHasCheckbox = !!headerCell.querySelector('input[type="checkbox"], input[type="radio"]');
      const headerIsAction = /^(detail|action|actions)$/.test(headerText);
      const headerIsEmpty = headerText.length === 0;

      const columnHasControls = bodyRows.some((row) => {
        const cell = row.children.item(i) as HTMLElement | null;
        if (!cell) return false;
        return !!cell.querySelector('button, a, input[type="checkbox"], input[type="radio"]');
      });

      if (headerHasCheckbox) drop.add(i);
      else if (headerIsAction) drop.add(i);
      else if (headerIsEmpty && columnHasControls) drop.add(i);
    }

    if (drop.size) {
      const sorted = Array.from(drop).sort((a, b) => b - a);
      for (const row of Array.from(table.querySelectorAll('tr'))) {
        for (const idx of sorted) {
          const cell = row.children.item(idx);
          if (cell) cell.remove();
        }
      }
    }
  }

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title ? String(title) : 'Print'}</title>
    <style>
      @page { margin: 12mm; }
      body { font-family: Arial, sans-serif; margin: 0; padding: 16px; color: #111827; }
      h1 { margin: 0 0 12px 0; font-size: 16px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #D1D5DB; padding: 8px; font-size: 12px; vertical-align: top; }
      th { background: #374151; color: #FFFFFF; text-align: left; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tbody tr:nth-child(even) td { background: #F9FAFB; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      /* Defensive: hide any remaining interactive UI inside tables */
      button, input, select, textarea { display: none !important; }
      .wrap { overflow: visible; }
    </style>
  </head>
  <body>
    ${title ? `<h1>${String(title)}</h1>` : ''}
    <div class="wrap">${cloned.outerHTML}</div>
  </body>
</html>`;

  // Use an iframe to avoid popup blockers.
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const cleanup = () => {
    try {
      iframe.remove();
    } catch {
      // ignore
    }
  };

  const doc = iframe.contentDocument;
  const win = iframe.contentWindow;
  if (!doc || !win) {
    cleanup();
    console.error('printTable: failed to access print iframe');
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Give the browser a tick to layout before printing.
  setTimeout(() => {
    try {
      win.focus();
      win.print();
    } finally {
      // Clean up after print dialog is opened.
      setTimeout(cleanup, 250);
    }
  }, 250);
}
