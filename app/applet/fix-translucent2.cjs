const fs = require('fs');

function replaceFile(path, rules) {
  let content = fs.readFileSync(path, 'utf8');
  for (const rule of rules) {
    content = content.replace(rule[0], rule[1]);
  }
  fs.writeFileSync(path, content, 'utf8');
}

replaceFile('src/components/AccountsTab.tsx', [
  [/bg-amber-50 rounded-xl border border-\[#ff7a00\]\/30/g, 'bg-[#1a0e0d] rounded-xl border border-[#ff7a00]/20'],
  [/text-amber-600/g, 'text-[#ff7a00]']
]);

replaceFile('src/components/ReportsTab.tsx', [
  [/bg-amber-50\/70 border-2 border-\[#ff7a00\]\/30/g, 'bg-[#1a0e0d] border border-[#ff7a00]/20'],
  [/text-amber-700/g, 'text-[#ff7a00]'],
  
  [/bg-emerald-50\/70 border-2 border-emerald-500\/30/g, 'bg-[#1a0e0d] border border-emerald-500/20'],
  
  [/bg-sky-50\/70 border-2 border-sky-500\/30/g, 'bg-[#1a0e0d] border border-sky-500/20'],
  
  [/bg-rose-50\/70 border-2 border-rose-500\/30/g, 'bg-[#1a0e0d] border border-rose-500/20'],
  
  [/text-rose-700/g, 'text-rose-500'],
  [/text-emerald-700/g, 'text-emerald-500'],
  [/text-sky-700/g, 'text-sky-500'],
]);

replaceFile('src/components/BillingTab.tsx', [
  [/bg-amber-50\/30/g, 'bg-[#1a0e0d]'],
  [/bg-amber-50\/50/g, 'bg-[#1a0e0d]'],
  [/bg-amber-50/g, 'bg-[#1a0e0d]'],
]);

console.log('Fixed translucent backgrounds again!');
