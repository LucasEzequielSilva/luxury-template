const fs = require('fs');
const path = require('path');

const dirsToScan = ['n8n-workflows'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.json')) {
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
  content = content.replace(/trendspot/g, 'iphoneluxury');
  content = content.replace(/5491127967222/g, '3757541930');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
  }
});
