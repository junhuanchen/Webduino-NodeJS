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
    main();
});

// 板子断开连接后 会运行此函数
board.on(webduino.BoardEvent.DISCONNECT, function () {
    console.log('board disconnect');
    board.disconnect();
    exit();
});

require('webduino-bit-module-led-matrix')(webduino); // 引入库到 webduino 的核心里

function main() {
    console.log('hello world');

    board.samplingInterval = 250;
    const matrix = new webduino.module.Matrix(board, 4, 25); // 配置 Bit 版型的 Led Matrix 对应引脚。
    matrix.setCharacter('1', '#ffff66'); // 显示单个字符
    matrix.setString('Hello the world.', '#ff0000', 1); // 显示字符串，可以从 blockly 里中获取得到对应的代码。
}

function exit() {
    console.log('program exit');
}