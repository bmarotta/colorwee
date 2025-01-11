import typescript from "@rollup/plugin-typescript";
import pkg from './package.json' assert { type: 'json' }

export default [{
  input: 'src/color.ts',
  output: [
    {
      file: "dist/color.es.js",
      format: "es",
      name: "colorwee" 
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript(),
  ],
}];