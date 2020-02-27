const fs = require('fs');
const stringSimilarity = require('string-similarity');

let michelin ;
let maitresrestaurateurs;

try {
    const jsonString = fs.readFileSync('./michelin.json')
    michelin = JSON.parse(jsonString)
} 
catch(err) {
    console.log(err)
    return null;
}

try {
    const jsonString = fs.readFileSync('./maitresrestaurateurs.json')
    maitresrestaurateurs = JSON.parse(jsonString)
} 
catch(err) {
    console.log(err)
    return null;
}


let name;
let address;
let tel;
const percent_name = 0.70;
const percent_tel = 0.8;
let maitres_bib = [];
let compt_name = 0;
let compt_tel=0;


for ( let i = 0; i < michelin.length; i++){

    for(let j=0; j < maitresrestaurateurs.length; j++){
        var similarity_name = stringSimilarity.compareTwoStrings(michelin[i].name.toLowerCase(), maitresrestaurateurs[j].name.toLowerCase());
        if(similarity_name >= percent_name){
            compt_name+=1;
            var similarity_tel = stringSimilarity.compareTwoStrings(michelin[i].tel, maitresrestaurateurs[j].tel);
            if(similarity_tel >= percent_tel){
                maitres_bib.push(michelin[i]);
            }
        }
    }  
    
}

const json = JSON.stringify(maitres_bib, null, 2);
fs.writeFile('./maitresbib.json', json, err => {
    if (err) {
        console.log('Error writing file', err);
    } 
    else {
        console.log('Successfully wrote file');
    }
});




