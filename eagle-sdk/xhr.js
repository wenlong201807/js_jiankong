/**
 * 面向切面编程
 * 在原型上扩展自定义需要的内容
 * 自身的请求不用拦截，否则形成循环上报
*/
let xhrHook = {
  init: (cb) => {
    // xhr hook
    let xhr = window.XMLHttpRequest; // 获取原型引用
    if (xhr._eagle_flag === true) { // 如果有人引入了性能监控的sdk，避免多次被引用
      return void 0;
    }
    xhr._eagle_flag = true;

    let _originOpen = xhr.prototype.open;
    // 面向切面编程思想: 在原型上扩展原有方法的功能，同时保证原来的功能不受影响
    xhr.prototype.open = function (method, url, async, user, password) {
      // TODO eagle url check
      this._eagle_xhr_info = {
        url: url,
        method: method,
        status: null
      };
      return _originOpen.apply(this, arguments);
    };

    let _originSend = xhr.prototype.send;
    xhr.prototype.send = function (value) {
      let _self = this;
      this._eagle_start_time = Date.now(); // 记录开始的时间

      // 高阶函数
      let ajaxEnd = (event) => () => {
        if (_self.response) {
          let responseSize = null;
          switch(_self.responseType) {
            case 'json':
              responseSize = JSON && JSON.stringify(_this.response).length;
              break;
            case 'blob':
            case 'moz-blob':
              responseSize = _self.response.size;
              break;
            case 'arraybuffer':
              responseSize = _self.response.byteLength;
            case 'document':
              responseSize = _self.response.documentElement && _self.response.documentElement.innerHTML && (_self.response.documentElement.innerHTML.length + 28);
              break;
            default:
              responseSize = _self.response.length;
          }
          _self._eagle_xhr_info.event = event;
          _self._eagle_xhr_info.status = _self.status;
          _self._eagle_xhr_info.success = (_self.status >= 200 && _self.status <= 206) || _self.status === 304;
          _self._eagle_xhr_info.duration = Date.now() - _self._eagle_start_time; // 监控系统自己报错，业务代码捕获错误
          _self._eagle_xhr_info.responseSize = responseSize;
          _self._eagle_xhr_info.requestSize = value ? value.length : 0; // value 未必有length 属性
          _self._eagle_xhr_info.type = 'xhr';
          cb(this._eagle_xhr_info);
        }
      };

      // TODO eagle url check
      if (this.addEventListener) {
        // 这三种状态都代表这个请求已经结束了。需要统计一些信息，并上报上去
        this.addEventListener('load', ajaxEnd('load'), false);
        this.addEventListener('error', ajaxEnd('error'), false);
        this.addEventListener('abort', ajaxEnd('abort'), false);
      } else {
        let _origin_onreadystatechange = this.onreadystatechange;
        this.onreadystatechange = function (event) {
          if (_origin_onreadystatechange) {
            _originOpen.apply(this, arguments);
          }
          if (this.readyState === 4) {
            ajaxEnd('end')();
          }
        };
      }
      return _originSend.apply(this, arguments);
    };

    // 扩展fetch
    // fetch hook
    if (window.fetch) {
      let _origin_fetch = window.fetch;
      window.fetch = function () {
        let startTime = Date.now();
        let args = [].slice.call(arguments);

        let fetchInput = args[0];
        let method = 'GET';
        let url;

        if (typeof fetchInput === 'string') {
          url = fetchInput;
        } else if ('Request' in window && fetchInput instanceof window.Request) {
          url = fetchInput.url;
          if (fetchInput.method) { // 不传的时候，默认是get，如果写了，可能是其他方式的请求
            method = fetchInput.method;
          }
        } else {
          url = '' + fetchInput;
        }

        // args 是伪数组，包含的内容是实参 扩展属性，同时保证原来的功能不缺失
        if (args[1] && args[1].method) {
          method = args[1].method;
        }

        // TODO eagle check 需要上报的内容，都放在这里
        let fetchData = {
          method: method,
          url: url,
          status: null,
        };

        // 重写原型方法，并且按需扩展
        return _origin_fetch.apply(this, args).then(function(response) {
          fetchData.status = response.status;
          fetchData.type = 'fetch';
          fetchData.duration = Date.now() - startTime;
          cb(fetchData);
          return response;
        });
      }
    }
  }
};

export default xhrHook;
