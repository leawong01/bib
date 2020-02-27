const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} url to get all the info needed
 */
const parse = data => {
  let $ = cheerio.load(data);
  let url=[];

  const res = $('.section-main div.restaurant__list-row div.col-md-6 h5.card__menu-content--title').each(function(i, elem) {
    url.push($(this)['0'].children[1].attribs.href);
    });
  
  if(url.length==0){return null;}
  
  return url;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
const scrapeRestaurant = async url => {
  let temp = [];
  let current_page=2;
  let restaurants = [];
  
  do{     
    try{
      const response = await axios(url+String(current_page));
      
      const {data, status} = response;

      if (status >= 200 && status < 300) //code pour savoir si l'url est bon par ex 404 site non existant
      {
        temp=parse(data);
        if(temp != null){
        restaurants.push(...temp)};   // ...temp ajoute seulement les elts du tableau temp 
      }
      else{
        console.error(status);
        return null;
      }
      current_page +=1;

    }catch(e){
      console.error(e);
    }

}while(temp != null);



return restaurants;
  


};

const scrapePage = async url => {
  let restaurants = [];
  let current = 0;
  do{
    try{
      const temp = await axios("https://guide.michelin.com/"+url[current]);
      const {data, status} = temp;
      if (status >= 200 && status < 300)
      {
      restaurants.push(parsePage(data));
      }
      else{
      console.error(status);
      return null;
      }
    }catch(e){
      console.error(e);
      return null;
    }
    current +=1;
  }while(current < url.length);

  return {restaurants};

}

const parsePage = data => {
  let name;
  let address;
  let tel;
  const $ = cheerio.load(data);
  name = $('div.restaurant-details div.container div.row div.col-xl-4 div.restaurant-details__heading.d-lg-none h2.restaurant-details__heading--title').text();
  address = $('div.restaurant-details__heading ul.restaurant-details__heading--list').text().trim().split('\n')[0];
  tel = $('.section-main div.row div.d-flex span.flex-fill').text().substring(0,17); 

  return {'name':name,'address':address, 'tel': tel};  
}


/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 */
module.exports.get = () => {
  return [];
};



  let ex = scrapeRestaurant('https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/');
  ex.then(response => {
    let temp = scrapePage(response);
    temp.then(result => {
      const json = JSON.stringify(result.restaurants,null,2);

      fs.writeFile('./michelin.json', json, err => {
        if (err) {
            console.log('Error writing file', err);
        } 
        else {
            console.log('Successfully wrote file');
        }
      })

    });
  });






