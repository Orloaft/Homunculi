import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main-modular.js',
  output: {
    file: 'dist/game-bundle.js',
    format: 'iife',
    name: 'WizBizGame',
    globals: {
      'phaser': 'Phaser'
    }
  },
  external: ['phaser'],
  plugins: [
    nodeResolve(),
    terser({
      compress: {
        drop_console: false,  // Keep console logs for debugging
        passes: 2,
        pure_funcs: ['console.log'],  // Remove in production
        inline: 2,  // Inline functions
        unsafe: true,  // More aggressive optimizations
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true
      },
      mangle: {
        properties: false  // Don't mangle property names
      },
      format: {
        comments: false
      }
    })
  ]
};