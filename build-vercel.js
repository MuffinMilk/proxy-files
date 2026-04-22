import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function copyDir(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn(`Warning: Source directory "${src}" does not exist. Skipping...`);
        return;
    }
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
        entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
    }
}

console.log("Building static export for Vercel...");
try {
    if (fs.existsSync('public')) {
        fs.rmSync('public', { recursive: true, force: true });
    }
    fs.mkdirSync('public', { recursive: true });
    
    copyDir('static', 'public');
    copyDir('dist', 'public/scram');
    copyDir('assets', 'public/assets');
    
    // Explicitly define paths for dependencies if standard exports fail
    const ultravioletPath = path.join(__dirname, 'node_modules/@titaniumnetwork-dev/ultraviolet/dist');
    const bareMuxPathFixed = baremuxPath || path.join(__dirname, 'node_modules/@mercuryworkshop/bare-mux/dist');
    const epoxyPathFixed = epoxyPath || path.join(__dirname, 'node_modules/@mercuryworkshop/epoxy-transport/dist');
    const libcurlPathFixed = libcurlPath || path.join(__dirname, 'node_modules/@mercuryworkshop/libcurl-transport/dist');
    const bareModulePathFixed = bareModulePath || path.join(__dirname, 'node_modules/@mercuryworkshop/bare-as-module3/dist');
    
    // Copy node_modules assets - handle potential failures gracefully
    const paths = [
        { path: bareMuxPathFixed, dest: 'public/baremux', name: 'baremux' },
        { path: epoxyPathFixed, dest: 'public/epoxy', name: 'epoxy' },
        { path: libcurlPathFixed, dest: 'public/libcurl', name: 'libcurl' },
        { path: bareModulePathFixed, dest: 'public/baremod', name: 'baremod' },
        { path: ultravioletPath, dest: 'public/uv', name: 'ultraviolet' }
    ];

    for (const p of paths) {
        try {
            if (p.path) {
                copyDir(p.path, p.dest);
            } else {
                console.warn(`Path for ${p.name} is undefined.`);
            }
        } catch (e) {
            console.warn(`Failed to copy ${p.name}:`, e.message);
        }
    }

    console.log("Static export complete! Files are in the 'public' directory.");
} catch (err) {
    console.error("Critical error during static export:", err);
    process.exit(1);
}
