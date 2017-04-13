var http = require('http');
var moment = require('moment');
var parseString = require('xml2js').parseString;

var lastRequest;
var lastPrice;

function getGoldPrice(callback) {
  var date = moment();
  if (lastRequest && !lastRequest.isBefore(date.add(-1, 'hour'))) {
    callback(lastPrice);
    return;
  }
  lastRequest = moment();
  var path = date.format("DD/MM/YYYY");
  date.add(-14, 'days');
  path = '/scripts/xml_metall.asp?date_req1=' + date.format("DD/MM/YYYY") + '&date_req2=' + path;
  getXmlData(path, function (data) {
    var prices = data["Metall"]["Record"]
      .filter(function (record) {
        return record['$']['Code'] == 1;
      });
    var maxDate = Math.max.apply(null, prices.map(function (record) {
      return Date.parse(record['$']['Date'].split('.').reverse().join('-'));
    }));
    var result = Number(prices.find(function (record) {
      return Date.parse(record['$']['Date'].split('.').reverse().join('-')) == maxDate;
    })['Buy'][0].replace(',', '.'));
    lastPrice = result;
    callback(result);
  });
}


function getXmlData(path, doneCallback) {

  var options = {
    host: "www.cbr.ru",
    port: 80,
    method: 'GET',
    path: path
  };

  var req = http.request(options, function (response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      if (str == "Not found") {
        doneCallback("Not found");
        console.warn("Not found. Path: " + path);
        return;
      }
      parseString(str, function (err, result) {
        doneCallback(result);
      });
      //FIXME use next callback
    });

  });

  req.on('error', function (err) {
    if (err.message.code == 'ETIMEDOUT') {
      console.warn("timeout");
      getXmlData(path, projector, doneCallback);
    }
    if (err.message.code == "ECONNRESET") {
      console.warn("connection reset");
      getXmlData(path, projector, doneCallback);
    }

  });

  req.end();
}

module.exports.getGoldPrice = getGoldPrice;
