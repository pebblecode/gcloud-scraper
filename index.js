'use strict';

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serviceId = 1234567890123458;
var URLS = process.argv[2].split(' ');

URLS.forEach(function (URL) {
  console.log('url: ' + URL);
  (0, _request2.default)(URL, function (err, res, bod) {
    if (err) console.error(err);
    console.log(res.statusCode);
    findInfo(bod);
  });
});

function capitalizeFirstLetter(string, defaultString) {
  if (!string) return defaultString;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function findInfo(res) {
  var $ = _cheerio2.default.load(res);
  var priceArr = $('.price').text().split(' per ');
  var price = priceArr[0].match(/[0-9]+/)[0];
  var priceUnit = capitalizeFirstLetter(priceArr[1], 'Person');
  var priceInterval = capitalizeFirstLetter(priceArr[2], 'Day');
  var features = $('.service-summary-features-and-benefits')[0];
  var benefits = $('.service-summary-features-and-benefits')[1];

  serviceId++;
  var outputJson = {
    "id": serviceId.toString(),
    "supplierId": 700000,
    "lot": "supply_teachers",
    "frameworkName": "inoket-1",
    "frameworkSlug": "inoket-1",
    "createdAt": "2014-12-23T14:51:19Z",
    "serviceSummary": $('.service-summary-lede').text(),
    "priceUnit": priceUnit,
    "priceInterval": priceInterval,
    "priceMax": price,
    "pricingDocumentURL": $($('.document-list-item a')[0]).attr('href'),
    "minimumContractPeriod": priceInterval,
    "serviceName": $('.page-heading-smaller h1').text(),
    "vatIncluded": true,
    "serviceFeatures": $(features).find('li').get().map(function (e) {
      return e.children[0].data;
    }),
    "priceMin": price,
    "serviceBenefits": $(benefits).find('li').get().map(function (e) {
      return e.children[0].data;
    })
  };

  console.log(outputJson);
  _fs2.default.writeFileSync('./' + serviceId + '.json', JSON.stringify(outputJson));
}

// {
//  "serviceSummary": "tdgsg",
//  "priceUnit": "Unit",
//  "priceInterval": "Minute",
//  "priceMax": "9",
//  "pricingDocumentURL": "http://localhost:5003/suppliers/assets/inoket-1/submissions/700000/6-pricing-document-2016-06-09-1144.pdf",
//  "minimumContractPeriod": "Hour",
//  "serviceName": "test",
//  "vatIncluded": true,
//  "serviceFeatures": [
//   "sdas",
//   "asdad"
//   ],
//  "priceMin": "5",
//  "serviceBenefits": [
//    "asdad",
//    "sdad"
//  ]
// }
