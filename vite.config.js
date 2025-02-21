import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    // 使用 @ 作為 src 目錄的別名
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "https://localhost:7092",
                changeOrigin: true,
                secure: false,
            },
        },
        https: {
            // key: fs.readFileSync("./localhost-key.pem"),
            // key: fs.readFileSync("./localhost+2-key.pem"),
            // cert: fs.readFileSync("./localhost.pem"),
            // cert: fs.readFileSync("./localhost+2.pem"),
            //弘儒
            // key: fs.readFileSync("./localhost-key-HongRu.pem"),
            // cert: fs.readFileSync("./localhost-HongRu.pem"),
            key: fs.readFileSync("./localhost_key-HongRu.pem"),
            cert: fs.readFileSync("./localhost_HongRu.pem"),
        },
        host: true,
        port: 5173,
        strictPort: true,
        open: true,
        cors: true,
    },
});
