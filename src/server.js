let Path = require('path');
let Hapi = require('hapi');
var Good = require('good');
var fs = require('fs');
var _ = require('underscore');
var blogPosts, blogPostsByYear, blogPostsByTag;

function reloadData() {
  delete require.cache[require.resolve('./blogPostManifest.js')];
  blogPosts = require('./blogPostManifest.js');
  blogPosts.forEach(blogPost =>
    blogPost.body = fs.readFileSync(`${__dirname}/public/markdown/blog/${blogPost.id}.markdown`, 'utf-8'));
  blogPostsByYear = _(blogPosts).groupBy(blogPost =>
    blogPost.created.getFullYear());
  blogPostsByTag = {};
  _(blogPosts).each(blogPost => {
    _(blogPost.tags).each(tag => {
      blogPostsByTag[tag] = blogPostsByTag[tag] || [];
      blogPostsByTag[tag].push(blogPost);
    });
  });
}

reloadData();

let server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: false,
    },
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
  path: '/refresh',
  handler: function (request, reply) {
    reloadData();
    reply.redirect('/');
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
  path: '/blog/modified/{year}',
  handler: function (request, reply) {
    reply.redirect(`/blog/posted/${request.params.year}`);
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
  path: '/blog/tagged/{tag}',
  handler: function (request, reply) {
    reply.file('index.html');
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/posted/{year}',
  handler: function (request, reply) {
    reply(blogPostsByYear[request.params.year] || []).code(200);
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/tagged/{tag}',
  handler: function (request, reply) {
    reply(blogPostsByTag[request.params.tag] || []).code(200);
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
