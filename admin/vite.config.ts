import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
/**
 * Vite configuration for the admin app.
 *
 * @remarks
 * Registers the Tailwind CSS v4 Vite plugin so CSS is compiled by Tailwind; no
 * other Vite options are customized here.
 */
export default defineConfig({
  plugins: [tailwindcss()],
});
