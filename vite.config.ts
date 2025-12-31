import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "ethers", "@solana/web3.js"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        // keep your css naming logic if you want:
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "style.css";
          return "assets/[name][extname]";
        },
      },
    },
    copyPublicDir: false,
  },
  assetsInclude: ["**/*.png", "**/*.svg", "**/*.jpg"],
});
