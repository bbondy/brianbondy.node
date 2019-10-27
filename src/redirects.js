import { blogPosts } from './cache.js'

var _ = require('underscore')

export function setupRedirects (server) {
  server.route({
    method: 'GET',
    path: '/blog/modified/{year}',
    handler: function (request, reply) {
      return reply.redirect(`/blog/posted/${request.params.year}`).permanent()
    }
  })

  server.route({
    method: 'GET',
    path: '/blog/id/{id}/{slug}',
    handler: function (request, reply) {
      const blogPost = _(blogPosts).find(post =>
        post.id === Number(request.params.id))
      return reply.redirect(blogPost.url).permanent()
    }
  })

  server.route({
    method: 'GET',
    path: '/blog/page/{page}',
    handler: function (request, reply) {
      return reply.redirect(`/page/${request.params.page}`).permanent()
    }
  })

  server.route({
    method: 'GET',
    path: '/blog/id/{id}',
    handler: function (request, reply) {
      const blogPost = _(blogPosts).find(post =>
        post.id === Number(request.params.id))
      return reply.redirect(blogPost.url).permanent()
    }
  })

  server.route({
    method: 'GET',
    path: '/blog/{id}',
    handler: function (request, reply) {
      const blogPost = _(blogPosts).find(post =>
        post.id === Number(request.params.id))
      return reply.redirect(blogPost.url).permanent()
    }
  })

  // Note that I'm intentionally not using the stripTrailingSlash: true option because it
  // simply serves a second endpoint which is bad for PR juice.  301 is better.
  const maxDepth = 6
  const handler = (request, reply) => reply.redirect(`/${request.params.p}`).permanent()
  for (var i = 1; i <= maxDepth; i++) {
    server.route({
      method: 'GET',
      path: `/{p*${i}}/`,
      handler
    })
  }
}
