'use strict'

require('babel-polyfill')
let Path = require('path')
let Hapi = require('hapi')
var md5 = require('md5')
var striptags = require('striptags')
import {setupRedirects} from './redirects.js'
import {cookiePassword, adminModePassword} from './secrets.js'
import {reloadData, blogPosts, blogPostsByYear, blogPostsByTag, blogPostById, rssByTag, feed, sitemap, resumeHTML, resumePDF, tags, robotsTXT} from './cache.js'
import {slicePostsForPage, newFeedFromTag} from './helpers.js'
import {sendAdminEmail} from './sendEmail.js'
import {pageTitleByPath} from './titleByPath.js'
const siteName = 'Brian R. Bondy'

reloadData()

let server = new Hapi.Server({
  connections: {
    router: {
      stripTrailingSlash: false
    },
    routes: {
      files: {
        relativeTo: Path.join(__dirname, 'public')
      }
    }
  }
})

server.register(require('inert'), function (err) {
  if (err) {
    console.log('Failed to load vision.')
  }
})
server.register(require('vision'), function (err) {
  if (err) {
    console.log('Failed to load vision.')
  }
})

server.connection({ port: process.env.PORT || 32757 })
setupRedirects(server)

let indexPaths = ['/{name}', '/other/{name}', '/compression/{name}', '/math/{name}', '/mozilla/new', '/running',
  '/', '/blog', '/blog/filters', '/blog/posted/{year}', '/blog/tagged/{tag}',
  '/page/{page}', '/blog/posted/{year}/page/{page}', '/blog/tagged/{tag}/page/{page}',
  '/stackexchange-twitter/{page}', '/stackexchange-linkedin/{page}', '/stackexchange-facebook/{page}'
]

indexPaths.forEach(path => {
  server.route({
    method: 'GET',
    path: path,
    handler: function (request, reply) {
      reply.view('index', {
        title: pageTitleByPath(request.url.path)
      })
    }
  })
})

server.route({
  method: 'GET',
  path: '/blog/{id}/{slug}',
  handler: function (request, reply) {
    let id = request.params.id
    let blogPost = blogPostById(id)
    reply.view('index', {
      title: blogPost ? `${blogPost.title} - ${siteName}` : siteName,
      fbTitle: blogPost.title,
      fbSiteName: siteName,
      fbShareUrl: `https://brianbondy.com/${blogPost.url}`
    })
  }
})

server.route({
  method: 'GET',
  path: '/refresh',
  handler: function (request, reply) {
    reloadData()
    reply.redirect('/')
  }
})

server.route({
  method: 'GET',
  path: '/feeds/rss',
  handler: function (request, reply) {
    reply(feed.xml({indent: true})).type('application/rss+xml')
  }
})

server.route({
  method: 'GET',
  path: '/sitemap.xml',
  handler: function (request, reply) {
    sitemap.toXML(xml =>
      reply(xml).type('application/xml'))
  }
})

server.route({
  method: 'GET',
  path: '/resume/pdf',
  handler: function (request, reply) {
    reply(resumePDF).type('application/pdf')
  }
})

server.route({
  method: 'GET',
  path: '/robots.txt',
  handler: function (request, reply) {
    reply(robotsTXT).type('text/plain')
  }
})

server.route({
  method: 'GET',
  path: '/feeds/rss/{tag}',
  handler: function (request, reply) {
    var feedByTag = rssByTag[request.params.tag] || newFeedFromTag(request.params.tag)
    reply(feedByTag.xml({indent: true})).type('application/rss+xml')
  }
})

server.route({
  method: 'GET',
  path: '/resume/html',
  handler: function (request, reply) {
    reply(resumeHTML).type('text/html').code(200)
  }
})

server.route({
  method: 'GET',
  path: '/api/tags',
  handler: function (request, reply) {
    reply(tags).code(200)
  }
})

server.route({
  method: 'GET',
  path: '/api/blog/posted/{year}',
  handler: function (request, reply) {
    let posts = blogPostsByYear[request.params.year] || []
    reply(slicePostsForPage(posts, request.query.page)).code(200)
  }
})

server.route({
  method: 'GET',
  path: '/api/blog/tagged/{tag}',
  handler: function (request, reply) {
    let posts = blogPostsByTag[request.params.tag] || []
    reply(slicePostsForPage(posts, request.query.page)).code(200)
  }
})

server.route({
  method: 'GET',
  path: '/api/blog/{id}',
  handler: function (request, reply) {
    let blogPost = blogPostById(request.params.id)
    if (blogPost) {
      reply(blogPost).code(200)
    } else {
      reply('').code(404)
    }
  }
})

server.route({
  method: 'GET',
  path: '/api/blog',
  handler: function (request, reply) {
    reply(slicePostsForPage(blogPosts, request.query.page)).code(200)
  }
})

// Serve everythign else from the public folder
server.route({
  method: 'GET',
  path: '/{path*}',
  handler: {
    directory: {
      path: './'
    }
  }
})

/*
server.route({
  method: 'GET',
  path: '/.well-known/{path*}',
  handler: {
    directory: {
      path: 'well-known',
      showHidden: true,
      listing: true
    }
  }
})
*/

// Serve everythign else from the public folder
// Some old links used to point to /static, maybe some still exist too.
server.route({
  method: 'GET',
  path: '/static/{path*}',
  handler: {
    directory: {
      path: './'
    }
  }
})

// A hapi session plugin and cookie jar
const options = {
  storeBlank: false,
  cookieOptions: {
    password: cookiePassword,
    isSecure: false
  }
}
server.register({
  register: require('yar'),
  options
}, function (err) {
  if (err) {
    console.error('Error with cookie jar (yar)', err)
  }
})

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
}], function (err) {
  if (err) {
    throw err // something bad happened loading the plugin
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri)
  })
})

server.views({
  engines: { jade: require('jade') },
  path: Path.join(__dirname, 'templates'),
  compileOptions: {
    pretty: true
  }
})

const onRequest = function (request, reply) {
  if (request.info.host === 'www.brianbondy.com') {
    return reply.redirect('https://brianbondy.com' + (request.url.path || ''))
  } else {
    return reply.continue()
  }
}
server.ext('onRequest', onRequest)
