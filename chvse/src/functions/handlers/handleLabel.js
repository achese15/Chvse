module.exports = (client) => {
    client.handleLabel = (text) => {
        //const settings = require('../../data/settings.json');
        const sets = client.handleLoadAffiliates();
        let formats = Object.keys(sets);
        let reformed = text;
        formats.forEach((data)=>{
            let string = ""+sets[data]["name"]+"";
            //console.log(sets[data]["label"]);
            let pattern = new RegExp(string,"gi");
           reformed =  reformed.replaceAll(pattern,sets[data]["label"]);
        });

        return reformed;
    } 
}