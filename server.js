// content of index.js
const http = require('http')
const fs = require('fs');
const port = 6001


const requestHandler = (request, response) => {
    console.log(request.url)
    if (request.url === "/") {
        console.log('handle index')
        fs.readFile('./index.html', function (err, html) {

            response.writeHeader(200, {
                "Content-Type": "text/html"
            });
            response.write(html);
            response.end();
        });
        return;
    }
    console.log('handle other')
    console.log('=======================================')
    try {
        fs.readFile(request.url.replace('/', "./"), function (err, js) {
            if (err) {
                //console.log(err)
                response.write("not found");
                response.end();
                return;
            }
            response.writeHeader(200, {
                "Content-Type": "text/javascript"
            });
            response.write(js);
            response.end();
        });
    } catch (e) {

    }

}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})