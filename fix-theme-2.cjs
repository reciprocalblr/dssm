const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // borders
  content = content.replace(/border-slate-[12]00/g, 'border-[#2d1816]');
  content = content.replace(/border-slate-\d\d/g, 'border-[#2d1816]');
  content = content.replace(/border-\[#e2e8f0\]/g, 'border-[#2d1816]');
  content = content.replace(/border-slate-305/g, 'border-[#2d1816]');
  content = content.replace(/border-slate-150/g, 'border-[#2d1816]');

  // backgrounds
  content = content.replace(/bg-slate-100/g, 'bg-[#1a0e0d]');
  content = content.replace(/bg-slate-150/g, 'bg-[#150a09]');

  // texts
  content = content.replace(/text-\[#1e293b\]/g, 'text-[#f4eae6]');
  content = content.replace(/text-slate-200/g, 'text-[#a28c89]/50');
  content = content.replace(/text-slate-300/g, 'text-[#a28c89]/70');
  content = content.replace(/text-slate-400/g, 'text-[#a28c89]');
  content = content.replace(/text-slate-805/g, 'text-[#f4eae6]');
  content = content.replace(/text-slate-850/g, 'text-[#f4eae6]');
  content = content.replace(/text-slate-605/g, 'text-[#a28c89]');
  content = content.replace(/text-slate-702/g, 'text-[#a28c89]');
  content = content.replace(/text-slate-750/g, 'text-[#a28c89]');
  content = content.replace(/text-stone-405/g, 'text-[#a28c89]/60');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Second pass applied');
