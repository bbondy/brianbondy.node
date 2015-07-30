require('babel/polyfill');
let Path = require('path');
let Hapi = require('hapi');
var Good = require('good');
var fs = require('fs');
var _ = require('underscore');
var blogPosts, blogPostsByYear, blogPostsByTag, rssByTag;
var tags = {};
var RSS = require('rss');
let feed = '';
import {setupRedirects} from './redirects.js';
const postsPerPage = 3;

var marked = require('marked');
var highlight = require('highlight.js');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

function beginPostIndex(page = 1) {
  return (page - 1) * postsPerPage;
}

function endPostIndex(page = 1) {
  return beginPostIndex(page) + postsPerPage;
}

function slicePostsForPage(posts, page) {
  return posts.slice(beginPostIndex(page), endPostIndex(page));
}

function feedItemFromBlogPost(blogPost) {
  return {
    title: blogPost.title,
    description: marked(blogPost.body),
    guid: `http://www.brianbondy.com/blog/id/${blogPost.id}`,
    categories: blogPost.tags,
    author: 'Brian R. Bondy',
    date: blogPost.created,
  };
}

function newFeedFromTag(tag) {
  return new RSS({
    title: `Brian R. Bondy\'s feed for tag ${tag}`,
    description: `Blog posts tagged ${tag} by Brian R. Bondy`,
    'feed_url': `http://www.brianbondy.com/feeds/rss/${tag}`,
    'site_url': `http://www.brianbondy.com/blog/tagged/${tag}`,
    'image_url': 'http://www.brianbondy.com/img/logo.png',
  });
}

function reloadData() {
  feed = new RSS({
    title: 'Brian R. Bondy\'s Feed',
    description: 'Blog posts by Brian R. Bondy',
    'feed_url': 'http://www.brianbondy.com/feeds/rss',
    'site_url': 'http://www.brianbondy.com',
    'image_url': 'http://www.brianbondy.com/img/logo.png',
  });

  delete require.cache[require.resolve('./blogPostManifest.js')];
  blogPosts = require('./blogPostManifest.js');
  blogPosts.forEach(blogPost => {
    blogPost.body = marked(fs.readFileSync(`${__dirname}/public/markdown/blog/${blogPost.id}.markdown`, 'utf-8'));
    if (fs.existsSync(`${__dirname}/public/archived-comments/${blogPost.id}.html`)) {
      blogPost.comments = fs.readFileSync(`${__dirname}/public/archived-comments/${blogPost.id}.html`, 'utf-8');
    }
  });

  blogPostsByYear = _(blogPosts).groupBy(blogPost =>
    blogPost.created.getFullYear());
  blogPostsByTag = {};
  rssByTag = {};
  _(blogPosts).each(blogPost => {
    let rssItem = feedItemFromBlogPost(blogPost);
    feed.item(rssItem);
    _(blogPost.tags).each(tag => {
      // Get tags count
      tags[tag] = (tags[tag] || 0) + 1;

      // Get list of blog posts by tag
      blogPostsByTag[tag] = blogPostsByTag[tag] || [];
      blogPostsByTag[tag].push(blogPost);

      // Get RSS by tag
      rssByTag[tag] = rssByTag[tag] || newFeedFromTag(tag);
      rssByTag[tag].item(rssItem);
    });
  });

  tags = _(tags).map((count, name) => {
    return { name, count };
  }).sort((x, y) => y.count - x.count);

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
