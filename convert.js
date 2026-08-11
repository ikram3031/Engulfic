import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
}

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace next/link
  if (content.includes("from 'next/link'") || content.includes('from "next/link"')) {
    content = content.replace(/import Link from ['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
    content = content.replace(/<Link\s+([^>]*?)href=(['"]\{?[^'"]+\}?['"])/g, "<Link $1to=$2");
    changed = true;
  }

  // Replace next/image
  if (content.includes("from 'next/image'") || content.includes('from "next/image"')) {
    content = content.replace(/import Image from ['"]next\/image['"];?/g, "");
    content = content.replace(/<Image/g, "<img");
    // Next Image usually has width/height, we can leave them for img, but sometimes they are numbers
    changed = true;
  }

  // Replace next/navigation
  if (content.includes("next/navigation")) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]next\/navigation['"];?/g, (match, imports) => {
      let newImports = imports
        .replace('useRouter', 'useNavigate')
        .replace('usePathname', 'useLocation');
      return `import { ${newImports} } from 'react-router-dom';`;
    });
    // Replace hook usage
    content = content.replace(/useRouter\(\)/g, "useNavigate()");
    content = content.replace(/usePathname\(\)/g, "useLocation()");
    // For useNavigate, instead of router.push, it's navigate()
    content = content.replace(/router\.push\(/g, "navigate(");
    content = content.replace(/router\.replace\(/g, "navigate(");
    content = content.replace(/router\.back\(\)/g, "navigate(-1)");
    changed = true;
  }

  // Remove metadata exports
  if (content.includes("export const metadata")) {
    content = content.replace(/export\s+const\s+metadata\s*=\s*\{[^}]+\};?/g, "");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
