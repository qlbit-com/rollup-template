import riot from 'rollup-plugin-riot'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import riotRegister from 'rollup-plugin-riot-register'
import serve from 'rollup-plugin-serve-proxy'
import livereload from 'rollup-plugin-livereload'

const devMode = 'production' !== process.env.mode //DP: set for release target in package.json
console.log( `${ devMode ? 'development' : 'production' } mode bundle` )

export default {
  input: 'src/index.js',
  watch: {
    include: './src/**',
    clearScreen: false
  },
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
    nodeResolve( { browser: true } ),
    riot(),
    commonjs(),
    riotRegister( [ './src/**/*.riot' ] ),
    devMode && serve( {
      contentBase: '.',

      // Options used in setting up server
      host: 'localhost',
      port: 3000,
      // Set up simple proxy
      // this will route all traffic starting with
      // `/api` to http://localhost:8181/api
      proxy: {
        api: 'http://localhost:8181'
      }
    } ),
    devMode && livereload( {
      port:  3002,
      delay: 200
    } )
  ]
}