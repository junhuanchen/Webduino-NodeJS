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

// 板子连接成功后 会运行此函数
board.on(webduino.BoardEvent.READY, function () {
    console.log('board connected');
    isconnected = true;
});

// 板子连接过程中出错 会运行此函数
board.on(webduino.BoardEvent.ERROR, function (err) {
    console.log('board error', err.message);
});

// 板子断开连接前 会运行此函数
board.on(webduino.BoardEvent.BEFOREDISCONNECT, function () {
    console.log('board before disconnect');
});

// 板子断开连接后 会运行此函数
board.on(webduino.BoardEvent.DISCONNECT, function () {
    console.log('board disconnect');
    board.disconnect();
});