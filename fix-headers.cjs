const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex specifically for the top headers
  content = content.replace(
    /className="flex flex-col md:flex-row md:items-center md:justify-between gap-4([^"]*)"/g,
    'className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#100504]/70 backdrop-blur-md border border-[#2d1816] rounded-2xl p-5 shadow-lg"'
  );

  content = content.replace(
    /className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-\[#2d1816\] pb-4 gap-4"/g,
    'className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#100504]/70 backdrop-blur-md border border-[#2d1816] rounded-2xl p-5 shadow-lg"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
});
console.log('Headers fixed');
