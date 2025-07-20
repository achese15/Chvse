const fetch = require('node-fetch');

function isUrlValid(str) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(str);
   }

module.exports = (client) => {
    client.handleLinks = (text) => {
        //const settings = require('../../data/settings.json');
        const sets = client.handleLoadAffiliates();
       // console.log(sets)
        
        let formats = Object.keys(sets);
        let reformed = text.trim();
        formats.forEach((data)=>{
           // console.log(sets[data]["name"])
            let string = ""+sets[data]["name"]+"";
           // console.log(sets[data]["link"])
            let pattern = new RegExp(string,"gi");
            reformed = reformed.replaceAll(pattern,sets[data]["link"]);
        });

        if(isUrlValid(reformed)){
               return reformed;
        }else {
            return "https://www.google.com"
        }
    } 
}



