var RSS = require('rss');
var fs = require('fs');
import marked from './marked.js';

export const postsPerPage = 3;

export function beginPostIndex(page = 1) {
  return (page - 1) * postsPerPage;
}

export function endPostIndex(page = 1) {
  return beginPostIndex(page) + postsPerPage;
}

export function slicePostsForPage(posts, page) {
  return posts.slice(beginPostIndex(page), endPostIndex(page));
}

export function feedItemFromBlogPost(blogPost) {
  return {
    title: blogPost.title,
    description: marked(blogPost.body),
    guid: `http://www.brianbondy.com/blog/id/${blogPost.id}`,
    categories: blogPost.tags,
    author: 'Brian R. Bondy',
    date: blogPost.created,
  };
}

export function sitemapItemFromBlogPost(blogPost) {
  return {
    url: `/blog/${blogPost.id}`,
    lastmod: fs.statSync(`${__dirname}/public/markdown/blog/${blogPost.id}.markdown`).mtime,
  };
}

export function sitemapItemFromSlug(slug) {
  return {
    url: `/${slug}`,
    lastmod: fs.statSync(`${__dirname}/public/markdown/${slug}.markdown`).mtime,
  };
}

export function newFeedFromTag(tag) {
  return new RSS({
    title: `Brian R. Bondy\'s feed for tag ${tag}`,
    description: `Blog posts tagged ${tag} by Brian R. Bondy`,
    'feed_url': `http://www.brianbondy.com/feeds/rss/${tag}`,
    'site_url': `http://www.brianbondy.com/blog/tagged/${tag}`,
    'image_url': 'http://www.brianbondy.com/img/logo.png',
  });
}


