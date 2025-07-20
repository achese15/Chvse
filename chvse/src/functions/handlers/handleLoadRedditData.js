const fetch = require('node-fetch');
const fs = require('fs');
module.exports = (client) => {
    client.LoadRedditData = () => {
        const fileName = "./src/data/old.txt";
        let dataArrayy = [];

        try {
            const data = fs.readFileSync(fileName, "utf-8");
            dataArrayy = data.split("%");
            client.redditIds = dataArrayy;
            
        }catch (error){
            console.log(error);
        }
    

        return dataArrayy;
        //console.log(dataArrayy);
    } 
}



