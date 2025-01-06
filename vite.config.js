import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "tech-aly",
            project: "tech-aly-website"
        }
    }), sveltekit()], 
    optimizeDeps: {
        include: ['@exodus/schemasafe'] // Add this to make client-side validation work
      }
});