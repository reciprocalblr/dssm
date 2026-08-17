const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'DashboardTab.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace bg-white, text colors, and borders generally used for boxes
  content = content.replace(/bg-white/g, 'bg-[#100504]/70 backdrop-blur-md');
  
  // Make borders dark
  content = content.replace(/border-slate-[23]00/g, 'border-[#2d1816]');
  content = content.replace(/border-white/g, 'border-[#2d1816]');
  content = content.replace(/border-amber-[23]\d\d/g, 'border-[#ff7a00]/30');
  content = content.replace(/border-amber-[23]00/g, 'border-[#ff7a00]/30');
  content = content.replace(/border-sky-[23]\d\d/g, 'border-sky-500/30');
  content = content.replace(/border-emerald-[23]\d\d/g, 'border-emerald-500/30');
  content = content.replace(/border-rose-[23]\d\d/g, 'border-rose-500/30');

  // Fix text colors for dark background readability
  content = content.replace(/text-slate-800/g, 'text-[#f4eae6]');
  content = content.replace(/text-slate-700/g, 'text-[#f4eae6]');
  content = content.replace(/text-slate-900/g, 'text-white');
  content = content.replace(/text-stone-900/g, 'text-[#f4eae6]');
  content = content.replace(/text-\[#64748b\]/g, 'text-[#a28c89]');
  content = content.replace(/text-slate-500/g, 'text-[#a28c89]');
  content = content.replace(/text-slate-[68]00/g, 'text-[#a28c89]');

  // Fix inputs and background hovers
  content = content.replace(/bg-slate-50/g, 'bg-[#1a0e0d]');
  content = content.replace(/hover:bg-slate-50/g, 'hover:bg-[#1a0e0d]');
  content = content.replace(/hover:bg-slate-100/g, 'hover:bg-[#251210]');
  content = content.replace(/hover:text-slate-800/g, 'hover:text-[#f4eae6]');

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Done replacement');
