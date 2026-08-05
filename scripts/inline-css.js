// Inlines the compiled assets/tailwind.css into the <style id="tw-generated"> block
// of each HTML entrypoint, so pages ship with zero render-blocking CSS requests.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cssPath = path.join(root, '.build', 'tailwind.css');
const htmlFiles = ['index.html', '404.html'];

const css = fs.readFileSync(cssPath, 'utf8').trim();
const marker = /<style id="tw-generated">[\s\S]*?<\/style>/;
const replacement = `<style id="tw-generated">${css}</style>`;

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  const html = fs.readFileSync(filePath, 'utf8');
  if (!marker.test(html)) {
    throw new Error(`No <style id="tw-generated"> marker found in ${file}`);
  }
  fs.writeFileSync(filePath, html.replace(marker, replacement));
  console.log(`Inlined CSS into ${file} (${(css.length / 1024).toFixed(1)} KB)`);
}
