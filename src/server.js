require('babel/polyfill');
let Path = require('path');
let Hapi = require('hapi');
var _ = require('underscore');
import {setupRedirects} from './redirects.js';
import {cookiePassword} from './secrets.js';
import {reloadData, blogPosts, blogPostsByYear, blogPostsByTag, rssByTag, feed, tags} from './cache.js';
import {slicePostsForPage, newFeedFromTag} from './helpers.js';
import {initRedis, addComment, getComments} from './datastore.js';
import {newCaptcha} from './captcha.js';

initRedis(process.env.REDIS_PORT);
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
server.connection({ port: process.env.PORT || 3000 });
setupRedirects(server);

let indexPaths = ['/{name}', '/other/{name}', '/compression/{name}', '/math/{name}', '/mozilla/new',
  '/', '/blog', '/blog/posted/{year}', '/blog/tagged/{tag}', '/blog/{id}',
  '/page/{page}', '/blog/page/{page}', '/blog/posted/{year}/page/{page}', '/blog/tagged/{tag}/page/{page}',
  '/stackexchange-twitter/{page}', '/stackexchange-linkedin/{page}', '/stackexchange-facebook/{page}',
  ];

indexPaths.forEach(path => {
  server.route({
    method: 'GET',
    path: path,
    handler: function (request, reply) {
      reply.file('index.html');
    }
  });
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
  path: '/feeds/rss',
  handler: function (request, reply) {
    reply(feed.xml({indent: true})).type('application/rss+xml');
  }
});

server.route({
  method: 'GET',
  path: '/feeds/rss/{tag}',
  handler: function (request, reply) {
    var feedByTag = rssByTag[request.params.tag] || newFeedFromTag(request.params.tag);
    reply(feedByTag.xml({indent: true})).type('application/rss+xml');
  }
});

server.route({
  method: 'GET',
  path: '/captcha/test',
  handler: function (request, reply) {
    let {text, dataUrl} = newCaptcha();
    reply(`<img src='${dataUrl}'/><br>Text: ${text}`).type('text/html').code(200);
  }
});


server.route({
  method: 'GET',
  path: '/api/tags',
  handler: function (request, reply) {
    reply(tags).code(200);
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/posted/{year}',
  handler: function (request, reply) {
    let posts = blogPostsByYear[request.params.year] || [];
    reply(slicePostsForPage(posts, request.query.page)).code(200);
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/tagged/{tag}',
  handler: function (request, reply) {
    let posts = blogPostsByTag[request.params.tag] || [];
    reply(slicePostsForPage(posts, request.query.page)).code(200);
  }
});

server.route({
  method: 'POST',
  path: '/api/blog/{id}/comments',
  handler: function (request, reply) {
    if (request.payload.captcha.toLowerCase() !== request.session.get(`${request.params.id}-captcha`, true).toLowerCase()) {
      reply('wrong captcha!').code(405);
      return;
    }
    delete request.captcha;
    addComment(request.params.id, request.payload)
      .then(() => reply('').code(200))
      .catch(() => reply('Error posting comment to Redis').code(500));
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/{id}/comments',
  handler: function (request, reply) {
    getComments(request.params.id)
      .then((comments) => reply(comments).code(200))
      .catch(() => reply('Error obtaining comments from Redis').code(500));
  }
});

server.route({
  method: 'GET',
  path: '/api/captcha/{id}',
  handler: function (request, reply) {
    let {text, dataUrl} = newCaptcha();
    request.session.set(`${request.params.id}-captcha`, text);
    reply(dataUrl).code(200);
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
    reply(slicePostsForPage(blogPosts, request.query.page)).code(200);
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

// Serve everythign else from the public folder
server.route({
  method: 'GET',
  path: '/static/{path*}',
  handler: {
    directory: {
      path: './'
    }
  }
});


server.register([{
  // good is a process monitor that listens for one or more of the below 'event types'
  register: require('Good'),
  options: {
    reporters: [{
      reporter: require('good-console'),
      events: {
        response: '*',
        log: '*'
      }
    }]
  }
}, {
  // A hapi session plugin and cookie jar
  register: require('Yar'),
  options: {
    cookieOptions: {
      password: cookiePassword,
      // only used for captcha so this is ok
      isSecure: false,
    },
  },
}], function (err) {
  if (err) {
    throw err; // something bad happened loading the plugin
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});
