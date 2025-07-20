const fetch = require('node-fetch');
const fs = require('fs');
const Twit = require('twit');

module.exports = (client) => {
    client.handleTwitter = async () => {
        const stuff = require('../../data/settings.json');
        const config = stuff["twitter"];
        // Create a new instance of the Twit object
        const api = new Twit({
            consumer_key: config["consumer_key"],
            consumer_secret: config["consumer_secret"],
            access_token: config["access_token"],
            access_token_secret: config["access_token_secret"],
        });

            
            //  tweet 'hello world!'
            //
            api.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
                console.log(data)
            });


    } 
}