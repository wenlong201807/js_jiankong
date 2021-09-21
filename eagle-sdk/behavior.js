import getXpath from './util/xpath.js';

export default {
  init: (cb) => {
    cb();
    document.addEventListener('click', (e) => {
      let xpath = getXpath(e.target);
      console.log('xpath: ', xpath);
    }, false);
  }
}

// document.querySelector("body > div.box-wrap > ul > li:nth-child(1)")

// /html/body/div[2]/ul/li[1]