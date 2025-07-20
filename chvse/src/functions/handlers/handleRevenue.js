const http = require("http");
const url = require("url");
module.exports = (client) => {
    client.handleRevenue = async (member) => {
        const server = http.createServer((req, res) => {
            res.writeHead(200,{"Content-Type": "text/html"});
            res.end("thanks");
            var data = url.parse(req.url, true).query;
            //console.log(data);
            if(data !== null){
                    if(data.user && data.cid && data.sum){
                        if(client.users.cache.get(data.user)){
                            client.users.cache.get(data.user).send("Click ID: "+data.cid+" Just Made "+data.sum);
                        }
                        
                    }
                 }
        });

        server.listen(process.env.port, () => {
            console.log("Listening To Port:"+ process.env.port);
        })
    }
}