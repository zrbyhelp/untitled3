const http = require('http');
const url = require('url');

http.createServer(function (request, response) {
    let datas ={};
    response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    let {pathname,query} = url.parse(request.url,true);

    switch (pathname) {
        case "/menbers":
            const Members = require('./members');
            let members = new Members(query);
            members.sayHello().then(data => {
                response.end(JSON.stringify(data));
            });
            break;
        case "/order":
            const Order = require('./order');
            let order = new Order(query);
            order.sayHello().then(data => {
                response.end(JSON.stringify(data));
            });
            break;
    }

}).listen(8881);
console.log('Server running at http://127.0.0.1:8881/');