require('babel/polyfill');
let Path = require('path');
let Hapi = require('hapi');
var _ = require('underscore');
var md5 = require('md5');
var striptags = require('striptags');
import {setupRedirects} from './redirects.js';
import {cookiePassword, adminModePassword} from './secrets.js';
import {reloadData, blogPosts, blogPostsByYear, blogPostsByTag, rssByTag, feed, sitemap, resumeHTML, resumePDF, tags, robotsTXT} from './cache.js';
import {slicePostsForPage, newFeedFromTag} from './helpers.js';
import {initRedis, addComment, getComments, removeComment} from './datastore.js';
import {newCaptcha} from './captcha.js';
import {sendAdminEmail} from './sendEmail.js';

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
server.connection({ port: process.env.PORT || 32757 });
setupRedirects(server);

let indexPaths = ['/{name}', '/other/{name}', '/compression/{name}', '/math/{name}', '/mozilla/new', '/running',
  '/', '/blog', '/blog/posted/{year}', '/blog/tagged/{tag}', '/blog/{id}/{slug}',
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
  path: '/sitemap.xml',
  handler: function (request, reply) {
    sitemap.toXML(xml =>
      reply(xml).type('application/xml'));
  }
});


server.route({
  method: 'GET',
  path: '/resume/pdf',
  handler: function (request, reply) {
    reply(resumePDF).type('application/pdf');
  }
});


server.route({
  method: 'GET',
  path: '/robots.txt',
  handler: function (request, reply) {
    reply(robotsTXT).type('text/plain');
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
  path: '/resume/html',
  handler: function (request, reply) {
    reply(resumeHTML).type('text/html').code(200);
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
    let id = request.params.id;
    if (request.payload.captcha.toLowerCase() !== request.session.get(`${id}-captcha`, true).toLowerCase()) {
      reply('wrong captcha!').code(405);
      return;
    }
    delete request.payload.captcha;
    request.payload.datePosted = new Date().toISOString();

    let email = request.payload.email.toLowerCase().trim();
    request.payload.gravatarHash = md5(email);
    delete request.payload.email;

    addComment(id, request.payload)
      .then(() => reply('').code(200))
      .then(() => {
        let html = `<p>A new comment was added to blog post id: <a href='http://www.brianbondy.com/blog/${id}'>${id}</a></p>.\n\n
        <p><strong>name</strong>: ${request.payload.name}</p>\n\n
        <p><strong>email</strong>: ${email}</p>\n\n
        <p><strong>webpage</strong>: ${request.payload.webpage}</p>\n\n
        <p><strong>body</strong>: ${request.payload.body}</p>\n\n
        `;
        sendAdminEmail(`New comment posted on blog id: ${id}`, striptags(html), html);
      })
      .catch(() => reply('Error posting comment to Redis').code(500));
  }
});

server.route({
  method: 'DELETE',
  path: '/api/blog/{id}/comment',
  handler: function (request, reply) {
    if (request.query.adminModePass !== adminModePassword) {
      reply('wrong admin mode password!').code(405);
    }
    let id = request.params.id;
    removeComment(id, request.payload)
      .then(() => reply('').code(200))
      .catch(() => reply('Error deleting comment from Redis').code(500));
  }
});

server.route({
  method: 'GET',
  path: '/api/blog/{id}/comments',
  handler: function (request, reply) {
    getComments(request.params.id)
      .then((comments) => {
        comments = comments.sort((comment1, comment2) => new Date(comment1.datePosted).getTime() - new Date(comment2.datePosted).getTime());
        reply(comments).code(200);
      })
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
  register: require('good'),
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
  register: require('yar'),
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
