import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

console.log("Building static export for Vercel...");

fs.mkdirSync('public', { recursive: true });
copyDir('static', 'public');
copyDir('dist', 'public/scram');
copyDir('assets', 'public/assets');
copyDir(baremuxPath, 'public/baremux');
copyDir(epoxyPath, 'public/epoxy');
copyDir(libcurlPath, 'public/libcurl');
copyDir(bareModulePath, 'public/baremod');

console.log("Static export complete! Files are in the 'public' directory.");
