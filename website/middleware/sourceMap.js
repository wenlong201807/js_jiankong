// 反解sourceMap
// https://github.com/mozilla/source-map
/**
 * 实际工作中，需要将对应的map文件上传
*/

const fs = require('fs')
const path = require('path')
const sourceMap = require('source-map')

let sourceFileMap = {};
const fixPath = (filePath) => {
  return filePath.replace(/\.[\.\/]+/, '')
}
let sourcemapFilePath = path.join(__dirname, './main.bundle.js.map')
module.exports = async (ctx, next) => {
  // 访问地址 http://localhost:3003/sourcemap
  if (ctx.path === '/sourcemap') {
    // ctx.body = '1213'
    let sourceMapContent = fs.readFileSync(sourcemapFilePath, 'utf-8')
    let fileObj = JSON.parse(sourceMapContent)
    // ctx.body = fileObj
    let { sources } = fileObj;
    // sourceFileMap key 是修复过的path，value是没有修复过的path
    sources.forEach((item) => {
      sourceFileMap[fixPath(item)] = item;
    })

    let line = 555;
    let column = 17;
    const comsumer = await new sourceMap.SourceMapConsumer(sourceMapContent)
    let result = comsumer.originalPositionFor({ line, column })
    // result = {"source":"webpack:///react-app.js","line":10,"column":6,"name":null}
    let originSource = sourceFileMap[result.source]
    let sourcesContent = fileObj.sourcesContent[sources.indexOf(originSource)]
    let sourceContentArr = sourcesContent.split('\n')
      
    ctx.body = {
      result,
      originSource,
      sourcesContent,
      sourceContentArr,
    }
  }
  
  // 中间件特点，需要返回next()
  return next()
}