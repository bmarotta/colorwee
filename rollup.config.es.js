import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

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
    typescript({
      typescript: require('typescript'),
    }),
  ],
}];