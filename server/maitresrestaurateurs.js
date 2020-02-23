const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('qs');


const parse = data => {
    const $ = cheerio.load(data);
    let restaurants = [];
    let name = [];
    let address = [];
    let tel = [];
    let res = $('div.single_libel').each(function(i, elem) {
        name.push($(this).text().trim().split(" (")[0]);
    });
   res=$('div.single_info3').each(function(i,elem){
     let street = $(this)[0].children[3].children[3].children[0].data.trim();
     let city = ($(this)[0].children[3].children[3].children[0].next.next.data.trim());
     address.push(street + ' ' + city);
     tel.push(($(this)[0].children[5].children[3].children[0].data.trim()));
   });

   for(let i=0; i<name.length;i++){
     restaurants.push({'name':name[i],'address':address[i],'tel':tel[i]});
   }
   console.log(restaurants);

   if(restaurants.length == 0){return null;}

    return restaurants;
  };


  const scrapeRestaurant = async url => {
    let temp = [];
    let current_page=1;
    let restaurants = [];
    do{
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

}while(temp != null);
  
  
  
  return {restaurants};
  
  };

  let ex = scrapeRestaurant('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult');
  ex.then(response => console.log(response));



