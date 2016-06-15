import cheerio from 'cheerio';
import request from 'request';
import fs from 'fs';

let serviceId = 1234567890123458;
const URLS = process.argv[2].split(' ');


URLS.forEach(URL => {
  console.log(`url: ${URL}`);
  request(URL, (
    err,
    res,
    bod
   ) => {
    if (err) console.error(err);
    console.log(res.statusCode);
    findInfo(bod);
  })
})


function capitalizeFirstLetter(string, defaultString) {
  if (!string) return defaultString
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function findInfo (res) {
  const $ = cheerio.load(res);
  const priceArr = $('.price').text().split(' per ');
  const price = priceArr[0].match(/[0-9]+/)[0];
  const priceUnit = capitalizeFirstLetter(priceArr[1], 'Person');
  const priceInterval = capitalizeFirstLetter(priceArr[2], 'Day');
  const features = $('.service-summary-features-and-benefits')[0];
  const benefits = $('.service-summary-features-and-benefits')[1];

  serviceId++
  const outputJson = {
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
    "serviceFeatures": $(features).find('li').get().map((e) => e.children[0].data),
    "priceMin": price,
    "serviceBenefits": $(benefits).find('li').get().map((e) => e.children[0].data)
  };

  console.log(outputJson);
  fs.writeFileSync(`./${serviceId}.json`, JSON.stringify(outputJson));
}
