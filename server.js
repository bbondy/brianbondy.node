let Hapi = require('hapi');

let server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Test index!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Test ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
