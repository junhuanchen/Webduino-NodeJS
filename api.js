var request = require('request');
request({
    json: true,
    url: 'http://web.juhe.cn:8080/environment/air/cityair?' + require('querystring').stringify({
        city: 'dongguan', // 东莞
        key: "dbfaf7fba9ff2a254300fa59893be5f8" // 私人密钥
    }),
}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // console.log(body);
        if (body['reason'] == 'SUCCESSED!') {
            console.log(body['result'][0]['citynow']);
            console.log(body['result'][0]['citynow']['AQI']);
        }
    }
});