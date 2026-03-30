const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('mackempreende_cast_COMPLETO.xlsx');
const ws = wb.Sheets['Episódios e Convidados'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

const months = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };

let sql = `BEGIN;\nDELETE FROM eventos WHERE tipo = 'podcast' AND squad = 'Podcast';\n\n`;

for (let i = 4; i < data.length; i++) {
  const row = data[i];
  const col0Str = String(row[0]).trim();
  const ep_no = col0Str.replace('Ep.', '').trim();
  
  if (!col0Str.replace('.', '').replace('Ep', '').trim().match(/^\d+$/)) continue;
  if (!ep_no.match(/^\d+$/)) continue;
  
  const titulo = String(row[1] || '').replace(/'/g, "''").trim();
  const convidados_str = String(row[2] || '').trim();
  const cargo = String(row[3] || '').replace(/'/g, "''").trim();
  const data_raw = String(row[5] || '').trim();
  
  let dt = '2023-01-01 19:00:00-03';
  if (data_raw && data_raw.includes(' ')) {
    const parts = data_raw.replace(/\./g, '').toLowerCase().split(' ');
    if (parts.length >= 3) {
      const d = parts[0].padStart(2, '0');
      const monthPrefix = parts[1].substring(0, 3);
      const m = String(months[monthPrefix] || 1).padStart(2, '0');
      const y = parts[2];
      dt = `${y}-${m}-${d} 19:00:00-03`;
    }
  }
  
  const palestrantes = [];
  if (convidados_str) {
    const nomes = convidados_str.split(/ e | \/ |, /);
    for (const n of nomes) {
      const nomeLimpo = n.trim();
      if (nomeLimpo) {
        palestrantes.push({
          nome: nomeLimpo,
          empresa: cargo,
          is_backup: false
        });
      }
    }
  }
  
  const metaObj = { palestrantes, info_podcast: true };
  const metaStr = JSON.stringify(metaObj).replace(/'/g, "''");
  const desc = `Episódio ${ep_no} do MackEmpreende Cast com ${convidados_str.replace(/'/g, "''")}.`;
  
  sql += `INSERT INTO eventos (titulo, descricao, data_inicio, tipo, squad, confirmado, metadata) VALUES (\n`;
  sql += `  '${titulo}',\n`;
  sql += `  '${desc}',\n`;
  sql += `  '${dt}',\n`;
  sql += `  'podcast',\n`;
  sql += `  'Podcast',\n`;
  sql += `  true,\n`;
  sql += `  '${metaStr}'::jsonb\n`;
  sql += `);\n\n`;
}

sql += `COMMIT;\n`;

fs.writeFileSync('lib/scripts/import_podcast_completo.sql', sql, 'utf8');
console.log('Script SQL de importação do podcast gerado na pasta lib/scripts!');
