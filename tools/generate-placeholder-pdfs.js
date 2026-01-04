const fs = require('fs');
const path = require('path');

function escapePdfString(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');
}

function buildSimplePdf(titleText) {
  const text = escapePdfString(titleText);

  const stream = [
    'BT\n',
    '/F1 24 Tf\n',
    '72 720 Td\n',
    `(${text}) Tj\n`,
    'ET\n'
  ].join('');

  const streamLen = Buffer.byteLength(stream, 'utf8');

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}endstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += objects[i];
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');

  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (let i = 1; i < offsets.length; i += 1) {
    const off = String(offsets[i]).padStart(10, '0');
    pdf += `${off} 00000 n \n`;
  }

  pdf += 'trailer\n';
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${xrefStart}\n`;
  pdf += '%%EOF\n';

  return Buffer.from(pdf, 'utf8');
}

function main() {
  const outDir = path.join(__dirname, '..', 'frontend', 'public', 'docs');
  fs.mkdirSync(outDir, { recursive: true });

  const files = [
    {
      name: 'company-contract.pdf',
      title: 'Company Contract (Placeholder)'
    },
    {
      name: 'government-papers.pdf',
      title: 'Government Papers (Placeholder)'
    }
  ];

  for (const f of files) {
    const buf = buildSimplePdf(f.title);
    fs.writeFileSync(path.join(outDir, f.name), buf);
  }

  // eslint-disable-next-line no-console
  console.log(`Generated ${files.length} placeholder PDFs in ${outDir}`);
}

main();
