const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');
const fs = require('fs');


const parse = data => {
  const $ = cheerio.load(data);
  let restaurants = [];
  let name = [];
  let address = [];
  let tel = [];
  // to get the names
  let res = $('div.single_libel').each(function(i, elem) {
      name.push($(this).text().trim().split(" (")[0]);
  });
  // to get the address and the telephone number
  res=$('div.single_info3').each(function(i,elem){
    // the address is split in 2 part the first for the street and the second for the city
    let street = $(this)[0].children[3].children[3].children[0].data.trim();
    let city = ($(this)[0].children[3].children[3].children[0].next.next.data.trim());
    address.push(street + ' ' + city);
    tel.push(($(this)[0].children[5].children[3].children[0].data.trim()));
  });

  for(let i=0; i<name.length;i++){
    restaurants.push({'name':name[i],'address':address[i],'tel':tel[i]});
  }

  if(restaurants.length == 0){return null;}

  return restaurants;
};


const scrapeRestaurant = async url => {
  let temp = [];
  let current_page=1;
  let restaurants = [];
  do{
    try{
      // maitres restaurateurs site is using post function to get from page to page
      const response = await axios.post('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult', qs.stringify({'page' : current_page, 'request_id': '07d54324f80f6ac950149192e3d19cca'}));
      const {data, status} = response;
      if (status >= 200 && status < 300) //code pour savoir si l'url est bon par ex 404 site non existant
      {
        temp=parse(data);
        if(temp != null){
        restaurants.push(...temp)};   // ...temp ajoute seulement les elts du tableau temp 
      }
      else
      {
          console.error(status);
          return null;
      }
      current_page+=1;
    }catch(e){
      console.error(e);
      return null;
    }
  }while(temp != null);

  return {restaurants};
};

let ex = scrapeRestaurant('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult');
ex.then(response => {
  // once we get all the restaurants we write them in a json file
  const json = JSON.stringify(response.restaurants, null, 2);

    fs.writeFile('./maitresrestaurateurs.json', json, err => {
      if (err) {
          console.log('Error writing file', err);
      } 
      else {
          console.log('Successfully wrote file');
      }
    })
});



