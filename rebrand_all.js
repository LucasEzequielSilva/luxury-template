const fs = require('fs');
const path = require('path');

const dirsToScan = ['app', 'components', 'data', 'lib'];

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

  content = content.replace(/trendspot/gi, 'iPhone Luxury');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
