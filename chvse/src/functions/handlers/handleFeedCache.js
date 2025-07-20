const fs = require('fs');


module.exports = (client) => {
    client.ClearFeedCache = async () => {
        let array = await client.LoadRedditData();
        const halfLength = Math.ceil(array.length * 0.60);
        array.splice(0, halfLength);
        client.SaveRedditData(array);
    }
}