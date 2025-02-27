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
            // // key: fs.readFileSync("./localhost-key-key.pem"),
            // // cert: fs.readFileSync("./localhost-key.pem"),
            // key: fs.readFileSync("./localhost+2-key.pem"),
            // cert: fs.readFileSync("./localhost+2.pem"),
            // key: fs.readFileSync("./localhost-key-wenzhe.pem"),
            // cert: fs.readFileSync("./localhost-wenzhe.pem"),
            // key: fs.readFileSync("./localhost-key-HongRu.pem"),
            // cert: fs.readFileSync("./localhost-HongRu.pem"),
            // key: fs.readFileSync("./localhost-key-Tai-iSpan.pem"),
            // cert: fs.readFileSync("./localhost-Tai-iSpan.pem"),
            // key: fs.readFileSync("./localhost-key-Tai-Laptop.pem"),
            // cert: fs.readFileSync("./localhost-Tai-Laptop.pem"),
            key: fs.readFileSync("./localhost-key-David.pem"),
            cert: fs.readFileSync("./localhost-David.pem"),
        },
        host: true,
        port: 5173,
        strictPort: true,
        open: true,
        cors: true,
    },
});
