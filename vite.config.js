import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ─────────────────────────────────────────────────────────────
//  GitHub Pages serves this project from a sub-path that matches
//  the repository name: https://<username>.github.io/aeshu_birthday/
//  The `base` below MUST match that path (keep the leading and
//  trailing slashes). If you rename the repo, update this too.
// ─────────────────────────────────────────────────────────────
export default defineConfig({
  base: '/aeshu_birthday/',
  plugins: [react()],
});
