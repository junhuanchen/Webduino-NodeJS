'use strict';
// 获取调用的依赖 webduino-js 库
var webduino = require('webduino-js');
// 板子控制变量，以及是否连接的标记
var board, isconnected = false;
// 设定板子的信息，它会后台自动连接 MQTT 服务器，与板子建立连接。
board = new webduino.Arduino({
  'board': 'Bit',
  'device': 'bitd3d8d', // 你板子的 Device ID 号
  'transport': 'mqtt',
  'server': webduino.WebArduino.SERVER_CHINA, // DEFAULT_SERVER // 中国服务器和外国服务器
});

console.log('connecting board......');
setTimeout(function () {
  if (isconnected == false) {
    console.log('connecting board timeout');
    board.close();
  }
}, 20000); // 设定 20s 连接超时

// 板子连接过程中出错 会运行此函数
board.on(webduino.BoardEvent.ERROR, function (err) {
  console.log('board error', err.message);
});

// 板子断开连接前 会运行此函数
board.on(webduino.BoardEvent.BEFOREDISCONNECT, function () {
  console.log('board before disconnect');
});

// 板子连接成功后 会运行此函数
board.on(webduino.BoardEvent.READY, function () {
  console.log('board connected');
  isconnected = true;
  main();
});

// 板子断开连接后 会运行此函数
board.on(webduino.BoardEvent.DISCONNECT, function () {
  console.log('board disconnect');
  board.disconnect();
  exit();
});


require('webduino-bit-module-led-matrix')(webduino);

require('./webduino-bit-module-test')(webduino);

function main() {
  console.log('hello world');

  const test = new webduino.module.test('this is test');
  test.AQI('dongguan', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      if (body['reason'] == 'SUCCESSED!') {
        console.log(body['result'][0]['citynow']);

        var aqi = body['result'][0]['citynow']['AQI'];

        board.samplingInterval = 250;
        const matrix = new webduino.module.Matrix(board, 4, 25);
        matrix.setString('AQI-' + aqi, '#00cccc', 1);
      }
    }
  });
}

function exit() {
  console.log('program exit');
}