import babel from 'rollup-plugin-babel';
let isDev = process.env.NODE_ENV === 'develop';

let babelConfig = {
  "presets": [
    [
      "env", {
        "modules": false,
        "targets": {
          "browsers": ["chrome > 40", "safari >= 7"]
        }
      }
    ]
  ],
};

// rollup 配置对象 类似webpack的配置文件
export default {
  input : 'index.js',
  watch: {
    exclude: 'node_modules/**'
  },
  output : {
    file: isDev ? '../website/client/script/eagle-monitor/bundle.umd.js' : '../dist/bundle.umd.js',
    name: 'EagleMonitor',
    format: 'umd', // 支持所有格式
    sourcemap: true
  },
  plugins : [
    babel({
      babelrc: false,
      presets: babelConfig.presets,
      plugins: babelConfig.plugins,
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
