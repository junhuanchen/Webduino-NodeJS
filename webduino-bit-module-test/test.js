+(function (factory) {
  console.log()
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';

  var self;
  var proto;
  var Module = scope.Module;

  function Test(info) {
    Module.call(this);
    this._test = info;
    self = this;
  }
  // prototype => __proto__
  Test.prototype = proto = Object.create(Module.prototype, {
    constructor: {
      value: Test
    }
  });

  proto.test = function () {
    console.log(self._test);
  }

  proto.AQI = function (City, callback) {
    var request = require('request');
    request({
      json: true,
      url: 'http://web.juhe.cn:8080/environment/air/cityair?' + require('querystring').stringify({
        city: City,
        key: "dbfaf7fba9ff2a254300fa59893be5f8" // 私人密钥
      }),
    }, callback);
  }

  scope.module.test = Test;
}));