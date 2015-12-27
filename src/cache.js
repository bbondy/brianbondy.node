var fs = require('fs')
var sm = require('sitemap')
var RSS = require('rss')
var _ = require('underscore')

import marked from './marked.js'
import slugify from './slugify.js'
import {feedItemFromBlogPost, sitemapItemFromBlogPost, sitemapItemFromSlug, newFeedFromTag} from './helpers.js'

export let blogPosts, blogPostsByYear, blogPostsById, blogPostsByTag, rssByTag, feed, resumeHTML, resumePDF, tags, sitemap, robotsTXT

export function blogPostById (id) {
  return _(blogPosts).find(post => post.id === Number(id))
}

export function reloadData () {
  tags = {}
  feed = new RSS({
    title: 'Brian R. Bondy\'s Feed',
    description: 'Blog posts by Brian R. Bondy',
    'feed_url': 'http://www.brianbondy.com/feeds/rss',
    'site_url': 'http://www.brianbondy.com',
    'image_url': 'http://www.brianbondy.com/img/logo.png'
  })

  sitemap = sm.createSitemap({
    hostname: 'http://www.brianbondy.com',
    cacheTime: 0,
    urls: [
      { url: '/filters' },
      sitemapItemFromSlug('projects'),
      sitemapItemFromSlug('resume'),
      sitemapItemFromSlug('other'),
      sitemapItemFromSlug('about'),
      sitemapItemFromSlug('contact'),
      sitemapItemFromSlug('compression'),
      sitemapItemFromSlug('compression/huffman'),
      sitemapItemFromSlug('compression/BWT'),
      sitemapItemFromSlug('compression/PPM'),
      sitemapItemFromSlug('math'),
      sitemapItemFromSlug('math/main'),
      sitemapItemFromSlug('math/pi'),
      sitemapItemFromSlug('math/primes'),
      sitemapItemFromSlug('math/numberTheory'),
      sitemapItemFromSlug('math/graphTheory'),
      sitemapItemFromSlug('math/mathTricks'),
      sitemapItemFromSlug('faq'),
      sitemapItemFromSlug('khanacademy'),
      sitemapItemFromSlug('links'),
      sitemapItemFromSlug('books'),
      sitemapItemFromSlug('articles'),
      sitemapItemFromSlug('advice'),
      sitemapItemFromSlug('mozilla'),
      sitemapItemFromSlug('mozilla/new'),
      sitemapItemFromSlug('universityClasses'),
      sitemapItemFromSlug('braille'),
      sitemapItemFromSlug('morseCode'),
      sitemapItemFromSlug('running'),
      sitemapItemFromSlug('stackexchange')
    ]})

  delete require.cache[require.resolve('./blogPostManifest.js')]
  blogPosts = require('./blogPostManifest.js').default
  blogPosts.forEach(blogPost => {
    blogPost.body = marked(fs.readFileSync(`${__dirname}/public/markdown/blog/${blogPost.id}.markdown`, 'utf-8'))
    blogPost.url = `/blog/${blogPost.id}/${slugify(blogPost.title)}`
  })

  blogPostsByYear = _(blogPosts).groupBy(blogPost =>
    blogPost.created.getFullYear())
  blogPostsByTag = {}
  rssByTag = {}
  _(blogPosts).each(blogPost => {
    let rssItem = feedItemFromBlogPost(blogPost)
    sitemap.add(sitemapItemFromBlogPost(blogPost))
    feed.item(rssItem)
    _(blogPost.tags).each(tag => {
      // Get tags count
      tags[tag] = (tags[tag] || 0) + 1

      // Get list of blog posts by tag
      blogPostsByTag[tag] = blogPostsByTag[tag] || []
      blogPostsByTag[tag].push(blogPost)

      // Get RSS by tag
      rssByTag[tag] = rssByTag[tag] || newFeedFromTag(tag)
      rssByTag[tag].item(rssItem)
    })
  })

  tags = _(tags).map((count, name) => {
    return { name, count }
  }).sort((x, y) => y.count - x.count)
  resumeHTML = '<html><head><link rel="stylesheet" type="text/css" href="/css/resume.css"></head><body>' +
    marked(fs.readFileSync(`${__dirname}/public/markdown/resume.markdown`, 'utf-8')) + '<body></html>'

  resumePDF = fs.readFileSync(`${__dirname}/public/pdf/BrianRBondy_Resume.pdf`)
  robotsTXT = fs.readFileSync(`${__dirname}/public/txt/robots.txt`)
}
reloadData()
