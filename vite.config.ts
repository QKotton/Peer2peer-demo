import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base "./" = đường dẫn tương đối, chạy được ở GitHub Pages với BẤT KỲ tên repo nào
// (vì app dùng HashRouter nên không cần khai báo tên repo).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
});
