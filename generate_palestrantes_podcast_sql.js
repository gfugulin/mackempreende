const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('mackempreende_cast_COMPLETO.xlsx');
const ws = wb.Sheets['Episódios e Convidados'];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

let sql = `BEGIN;\n\n`;
sql += `-- ==========================================\n`;
sql += `-- INSERIR CONVIDADOS DO PODCAST NO DIRETÓRIO\n`;
sql += `-- ==========================================\n\n`;

const uniqueSpeakers = new Map();

for (let i = 4; i < data.length; i++) {
  const row = data[i];
  const col0Str = String(row[0]).trim();
  const ep_no = col0Str.replace('Ep.', '').trim();
  
  if (!col0Str.replace('.', '').replace('Ep', '').trim().match(/^\d+$/)) continue;
  if (!ep_no.match(/^\d+$/)) continue;
  
  const convidados_str = String(row[2] || '').trim();
  const cargo = String(row[3] || '').replace(/'/g, "''").trim();
  
  if (convidados_str) {
    const nomes = convidados_str.split(/ e | \/ |, /);
    for (const n of nomes) {
      const nomeLimpo = n.trim();
      // Ignora times/grupos genéricos para não poluir o diretório individual
      if (nomeLimpo && 
          !nomeLimpo.toLowerCase().includes('time ') && 
          !nomeLimpo.toLowerCase().includes('fundadores ') &&
          !nomeLimpo.toLowerCase().includes('membros ')) {
        
        if (!uniqueSpeakers.has(nomeLimpo)) {
          uniqueSpeakers.set(nomeLimpo, cargo);
        }
      }
    }
  }
}

// Generate secure inserts avoiding duplicates by name
for (const [nome, empresa] of uniqueSpeakers.entries()) {
  const nomeSql = nome.replace(/'/g, "''");
  const empresaSql = empresa ? `'${empresa}'` : 'NULL';
  
  sql += `INSERT INTO palestrantes (nome, empresa, status, squad_resp)\n`;
  sql += `SELECT '${nomeSql}', ${empresaSql}, 'contatado', 'Podcast'\n`;
  sql += `WHERE NOT EXISTS (\n`;
  sql += `  SELECT 1 FROM palestrantes WHERE nome ILIKE '${nomeSql}'\n`;
  sql += `);\n\n`;
}

sql += `COMMIT;\n`;

fs.writeFileSync('lib/scripts/insert_podcast_palestrantes.sql', sql, 'utf8');
console.log(`Script SQL gerado com ${uniqueSpeakers.size} convidados únicos!`);
