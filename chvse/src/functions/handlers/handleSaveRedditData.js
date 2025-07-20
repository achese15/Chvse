const fetch = require('node-fetch');
const fs = require('fs');
module.exports = (client) => {
    client.SaveRedditData = (save) => {
        if(!Array.isArray(save)){
            return "Input is not an Array";
        }
        
        const fileName = "./src/data/old.txt";
        
        const string = save.join("%");
        try{
            fs.writeFileSync(fileName,string);
            return true;
        } catch (error){
            console.log(error)
            return false;
        }
    } 
}



