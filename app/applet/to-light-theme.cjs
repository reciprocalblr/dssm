const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Colors mapping for Dark -> Light Theme
      
      // BACKGROUNDS
      content = content.replace(/bg-\[#100504\]\/70 backdrop-blur-md/g, 'bg-white/90 backdrop-blur-md');
      content = content.replace(/bg-\[#100504\]\/70/g, 'bg-white/90');
      content = content.replace(/bg-\[#100504\]/g, 'bg-[#faf8f5]');
      
      content = content.replace(/bg-\[#1a0e0d\]\/70/g, 'bg-white/70');
      content = content.replace(/bg-\[#1a0e0d\]\/50/g, 'bg-white/50');
      content = content.replace(/bg-\[#1a0e0d\]/g, 'bg-white');
      
      content = content.replace(/bg-\[#251210\]/g, 'bg-slate-50');
      content = content.replace(/bg-\[#2d1816\]/g, 'bg-slate-100');

      // HOVERS
      content = content.replace(/hover:bg-\[#1a0e0d\]/g, 'hover:bg-slate-50');
      content = content.replace(/hover:bg-\[#251210\]/g, 'hover:bg-slate-100');
      content = content.replace(/hover:bg-\[#2d1816\]/g, 'hover:bg-slate-200');

      // BORDERS
      content = content.replace(/border-\[#2d1816\]\/50/g, 'border-slate-200/50');
      content = content.replace(/border-\[#2d1816\]/g, 'border-slate-200');
      content = content.replace(/border-\[#1a0e0d\]/g, 'border-slate-300');
      
      // RING
      content = content.replace(/ring-\[#2d1816\]/g, 'ring-slate-200');
      
      // DIVIDE
      content = content.replace(/divide-\[#2d1816\]/g, 'divide-slate-200');

      // TEXT COLORS
      content = content.replace(/text-\[#f4eae6\]/g, 'text-slate-800');
      content = content.replace(/text-\[#a28c89\]/g, 'text-slate-500');
      content = content.replace(/text-\[#a28c89\]\/50/g, 'text-slate-500/50');
      content = content.replace(/text-\[#a28c89\]\/70/g, 'text-slate-500/70');
      
      // Some text combinations in dark: "text-white" -> when inside buttons it's fine, but what if it's general?
      // "group-hover:text-[#f4eae6]"
      content = content.replace(/hover:text-\[#f4eae6\]/g, 'hover:text-slate-800');
      content = content.replace(/group-hover:text-\[#f4eae6\]/g, 'group-hover:text-slate-800');
      
      content = content.replace(/hover:text-\[#a28c89\]/g, 'hover:text-slate-500');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'src', 'components'));
processDir(path.join(__dirname, 'src', 'pages')); // if any
console.log('Theme changed to light.');
