var Path = require('path');
let Hapi = require('hapi');

let server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
});
server.connection({ port: 3000 });

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply.file('index.html');
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
