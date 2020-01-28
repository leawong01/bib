const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  let names = [];
  const res = $('.section-main div.restaurant__list-row div.col-md-6 h5.card__menu-content--title').each(function(i, elem) {
    names.push($(this).text().trim());
  });
  if(Object.keys(names).length == 0 ){return null;}
  //console.log(names);
  return names;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeRestaurant = async url => {
  let temp = [];
  let current_page=1;
  let restaurants = [];
  do{
  const response = await axios(url+String(current_page));
  const {data, status} = response;

  if (status >= 200 && status < 300) //code pour savoir si l'url est bon par ex 404 site non existant
  {
    temp=parse(data);
    restaurants.push(temp);    
  }

  current_page +=1;

  console.error(status);

}while(temp != null);

return {restaurants};

};

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};


let ex = scrapeRestaurant('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/');

ex.then(response => console.log(response));
//getdatas('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/')


