let Path = require('path');
let Hapi = require('hapi');
var Good = require('good');
var blogPosts = require('./blogPostManifest.js');
var fs = require('fs');
var _ = require('underscore');

blogPosts.forEach(blogPost =>
  blogPost.body = fs.readFileSync(`${__dirname}/public/markdown/blog/${blogPost.id}.markdown`, 'utf-8'));

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
    reply.file('index.html');
  }
});

server.route({
  method: 'GET',
  path: '/other/{name}',
  handler: function (request, reply) {
    reply.file('index.html');
  }
});

server.route({
  method: 'GET',
  path: '/blog/{name}',
  handler: function (request, reply) {
    reply.file('index.html');
  }
});

server.route({
  method: 'GET',
  path: '/blog/posted/{year}',
  handler: function (request, reply) {
    reply.file('index.html');
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/posted/{year}',
  handler: function (request, reply) {
    server.log('info', 'howdy');
    let filteredBlogPosts = _(blogPosts).groupBy(blogPost =>
      blogPost.created.getFullYear())[request.params.year];
    if (filteredBlogPosts === undefined) {
      filteredBlogPosts = [];
    }
    reply(filteredBlogPosts).code(200);
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/{id}',
  handler: function (request, reply) {
    let blogPost = _(blogPosts).find(post =>
      post.id === Number(request.params.id));
    reply(blogPost).code(200);
  }
});

server.route({
  method: 'GET',
  path: '/api/blog',
  handler: function (request, reply) {
    reply(blogPosts).code(200);
  }
});

// Serve everythign else from the public folder
server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: './'
    }
  }
});

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
