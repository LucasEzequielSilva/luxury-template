const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'data', 'lib', 'n8n-workflows'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.md')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = dirsToScan.flatMap(walk);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/TrendSpot/g, 'iPhone Luxury');
  content = content.replace(/Trendspot/g, 'iPhone Luxury');
  content = content.replace(/5491127967222/g, '3757541930');

  // Colors
  content = content.replace(/green-300/g, 'amber-300');
  content = content.replace(/green-400/g, 'amber-400');
  content = content.replace(/green-500/g, 'amber-500');
  content = content.replace(/green-600/g, 'amber-600');
  content = content.replace(/green-700/g, 'amber-700');
  content = content.replace(/green-800/g, 'amber-800');
  content = content.replace(/green-900/g, 'amber-900');
  content = content.replace(/green-950/g, 'amber-950');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
