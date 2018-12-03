'use strict';
var webduino = require('webduino-js');
var board;

function daemon_server() {
    board = new webduino.Arduino({
        'board': 'Bit',
        'device': 'bitd3d8d',
        'transport': 'mqtt',
        'server': webduino.WebArduino.SERVER_CHINA,
    });

    board.on(webduino.BoardEvent.ERROR, function (err) {
        console.log('board error', err.message);
    });

    board.on(webduino.BoardEvent.DISCONNECT, function () {
        console.log('board disconnect');
    });

    board.on(webduino.BoardEvent.READY, function () {
        console.log(board.isConnected, board.isReady);
        console.log('board connected');
        main();
    });

    console.log('connecting board......');
    setTimeout(function () {
        if (board.isConnected == false) {
            console.log('connecting server fail');
            board.close();
        }
        if (board.isReady == false) {
            console.log('connecting board fail');
            board.close();
        }
    }, 5000);
    
}

daemon_server();

setInterval(function () {
    // console.log(board.isConnected, board.isReady);
    if (typeof (board.isConnected) == "undefined") {
        console.log("try re-connecting......");
        daemon_server();
    }
}, 10000);

require('webduino-bit-module-led-matrix')(webduino);
require('./webduino-bit-module-test')(webduino);

function main() {
  console.log('hello world');

  board.samplingInterval = 250;
  const test = new webduino.module.test('this is test');
  test.AQI('dongguan', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(body);
      if (body['reason'] == 'SUCCESSED!') {
        console.log(body['result'][0]['citynow']);
        var aqi = body['result'][0]['citynow']['AQI'];
        board.samplingInterval = 250;
        const matrix = new webduino.module.Matrix(board, 4, 25);
        matrix.setString(' AQI-' + aqi, '#00cccc', 1);
      }
    }
  });

}