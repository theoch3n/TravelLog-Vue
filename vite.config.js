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
            // key: fs.readFileSync("./keys/localhost-key-wenzhe.pem"),
            // cert: fs.readFileSync("./keys/localhost-wenzhe.pem"),
            // key: fs.readFileSync("./keys/localhost-key-HongRu.pem"),
            // cert: fs.readFileSync("./keys/localhost-HongRu.pem"),
            // key: fs.readFileSync("./keys/localhost-key-Tai-iSpan.pem"),
            // cert: fs.readFileSync("./keys/localhost-Tai-iSpan.pem"),
            key: fs.readFileSync("./keys/localhost-key-Tai-Laptop.pem"),
            cert: fs.readFileSync("./keys/localhost-Tai-Laptop.pem"),
            // key: fs.readFileSync("./keys/localhost-key-yanfeng.pem"),
            // cert: fs.readFileSync("./keys/localhost-yanfeng.pem"),
            // key: fs.readFileSync("./keys/localhost-key-David.pem"),
            // cert: fs.readFileSync("./keys/localhost-David.pem"),
            // key: fs.readFileSync("./keys/localhost-key-JiEn.pem"),
            // cert: fs.readFileSync("./keys/localhost-JiEn.pem"),
        },
        host: true,
        port: 5173,
        strictPort: true,
        open: true,
        cors: true,
    },
});
