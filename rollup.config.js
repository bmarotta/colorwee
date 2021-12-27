import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default [{
  input: 'src/color.ts',
  output: [
    {
      file: "dist/color.js",
      format: 'cjs',
      name: "colorwee"  
    },
  ],
  //preserveModules: true, // Uncomment to split in separate files
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