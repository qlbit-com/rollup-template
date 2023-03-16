import glob from 'fast-glob'

export default ( paths = [], source = "riot:components" ) => {
  const camelize = ( str ) =>
      ( ' ' + str ).toLowerCase().replace( /[-_\s.]+(.)?/g, ( _, c ) => c ? c.toUpperCase() : '' )
  return {
    name: source,
    resolveId: (id) => source === id ? id : undefined,
    load: async (id) => {
      if( source !== id )
        return undefined
      const imp = []
      const reg = []
      for( const path of await glob( paths ) ) {
        const tokens = path.split( '/' )
        const name = tokens[ tokens.length - 1 ].replace( /\.riot$/, '' )
        const cname = camelize( name )
        imp.push( `import ${ cname } from '${ path }'` )
        reg.push( `\n  register( '${ name }', ${ cname } )` )
      }
      const code = 'import { register } from \'riot\'\n' + imp.join( '\n' ) +
              '\n\nexport default () => {' + reg.join( ',' ) +'\n}\n'
      //console.log( code )
      return code
    }
  }
}
