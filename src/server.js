'use strict'

import { setupRedirects } from './redirects.js'
import { reloadData, blogPosts, blogPostsByYear, blogPostsByTag, blogPostById, rssByTag, feed, sitemap, resumeHTML, resumePDF, tags, robotsTXT } from './cache.js'
import { slicePostsForPage, newFeedFromTag } from './helpers.js'
import { pageTitleByPath } from './titleByPath.js'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
require('@babel/polyfill')
const Path = require('path')
const Hapi = require('hapi')

const siteName = 'Brian R. Bondy'

reloadData()

const server = new Hapi.Server({
  port: process.env.PORT || 32757,
  router: {
    stripTrailingSlash: false
  },
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'public')
    }
  }
})
console.log('starting server:\nhttp://localhost:32757')

setupRedirects(server)

const indexPaths = [
  '/{name}',
  '/other/{name}',
  '/compression/{name}',
  '/math/{name}',
  '/mozilla/new',
  '/running',
  '/',
  '/blog',
  '/blog/filters',
  '/blog/posted/{year}',
  '/blog/tagged/{tag}',
  '/page/{page}',
  '/blog/posted/{year}/page/{page}',
  '/blog/tagged/{tag}/page/{page}'
]

const provision = async () => {
  // For directory handler
  await server.register(Inert)
  await server.register(Vision)
  const options = {
    ops: {
      interval: 1000
    },
    reporters: {
      myConsoleReporter: [{
        module: '@hapi/good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }]
      }, {
        module: '@hapi/good-console'
      }, 'stdout']
    }
  }
  await server.register({
    plugin: require('@hapi/good'),
    options
  })

  indexPaths.forEach(path => {
    server.route({
      method: 'GET',
      path: path,
      handler: function (request, reply) {
        console.log('request uri is: ', request.url.pathname)
        return reply.view('index', {
          title: pageTitleByPath(request.url.pathname || '/')
        })
      }
    })
  })

  server.route({
    method: 'GET',
    path: '/blog/{id}/{slug}',
    handler: function (request, reply) {
      const id = request.params.id
      const blogPost = blogPostById(id)
      return reply.view('index', {
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
      return reply.redirect('/')
    }
  })

  server.route({
    method: 'GET',
    path: '/feeds/rss',
    handler: function (request, h) {
      return h.response(feed.xml({ indent: true })).type('application/rss+xml')
    }
  })

  server.route({
    method: 'GET',
    path: '/sitemap.xml',
    handler: function (request, h) {
      let sitemapXML
      sitemap.toXML(xml => {
        sitemapXML = xml
      })
      return h.response(sitemapXML).type('application/xml')
    }
  })

  server.route({
    method: 'GET',
    path: '/resume/pdf',
    handler: function (request, h) {
      return h.response(resumePDF).type('application/pdf')
    }
  })

  server.route({
    method: 'GET',
    path: '/robots.txt',
    handler: function (request, h) {
      return h.response(robotsTXT).type('text/plain')
    }
  })

  server.route({
    method: 'GET',
    path: '/feeds/rss/{tag}',
    handler: function (request, h) {
      var feedByTag = rssByTag[request.params.tag] || newFeedFromTag(request.params.tag)
      return h.response(feedByTag.xml({ indent: true })).type('application/rss+xml')
    }
  })

  server.route({
    method: 'GET',
    path: '/resume/html',
    handler: function (request, h) {
      return h.response(resumeHTML).type('text/html').code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/api/tags',
    handler: function (request, h) {
      return h.response(tags).code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/api/blog/posted/{year}',
    handler: function (request, h) {
      const posts = blogPostsByYear[request.params.year] || []
      return h.response(slicePostsForPage(posts, request.query.page)).code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/api/blog/tagged/{tag}',
    handler: function (request, h) {
      const posts = blogPostsByTag[request.params.tag] || []
      return h.response(slicePostsForPage(posts, request.query.page)).code(200)
    }
  })

  server.route({
    method: 'GET',
    path: '/api/blog/{id}',
    handler: function (request, h) {
      const blogPost = blogPostById(request.params.id)
      if (blogPost) {
        return h.response(blogPost).code(200)
      } else {
        return h.response('').code(404)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/api/blog',
    handler: function (request, h) {
      return h.response(slicePostsForPage(blogPosts, request.query.page)).code(200)
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

  server.views({
    engines: { jade: require('jade') },
    path: Path.join(__dirname, 'templates'),
    compileOptions: {
      pretty: true
    }
  })

  const onRequest = function (request, reply) {
    if (request.info.host === 'www.brianbondy.com') {
      return reply.redirect('https://brianbondy.com' + (request.path || '')).takeover()
    } else {
      return reply.continue
    }
  }
  server.ext('onRequest', onRequest)

  await server.start()
}

provision()
