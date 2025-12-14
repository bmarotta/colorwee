import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };
import terser from "@rollup/plugin-terser";
import cleanup from "rollup-plugin-cleanup";

export default [
    {
        input: "src/color.ts",
        output: [
            {
                file: "dist/color.js",
                format: "cjs",
                name: "colorwee",
                banner: "",
                plugins: [terser()],
                sourcemap: true
            },
            {
                file: "dist/color.es.js",
                format: "es",
                name: "colorwee",
                banner: "",
                plugins: [terser()],
                sourcemap: true
            }
        ],
        //preserveModules: true, // Uncomment to split in separate files
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
        plugins: [typescript(), cleanup({ comments: "none" })]
    }
];
