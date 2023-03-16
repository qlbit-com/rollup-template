import riot from 'rollup-plugin-riot'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import riotRegister from './rollup_riot_register.mjs'

const devMode = 'production' !== process.env.mode //DP: set for release target in package.json
console.log( `${ devMode ? 'development' : 'production' } mode bundle` )

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    sourcemap: devMode ? 'inline' : false,
    format: 'iife',
    plugins: [
      terser( {
        ecma: 2020,
        mangle: { toplevel: true },
        compress: {
          module: true,
          toplevel: true,
          unsafe_arrows: true,
          drop_console: !devMode,
          drop_debugger: !devMode
        },
        output: {
          quote_style: 1,
          comments: devMode ? 'all' : false
        }
      } )
    ]
  },
  plugins: [
    riot(),
    nodeResolve(),
    commonjs(),
    riotRegister( [ './src/**/*.riot' ] )
  ]
}