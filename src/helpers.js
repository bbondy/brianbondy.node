var RSS = require('rss');
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

export function newFeedFromTag(tag) {
  return new RSS({
    title: `Brian R. Bondy\'s feed for tag ${tag}`,
    description: `Blog posts tagged ${tag} by Brian R. Bondy`,
    'feed_url': `http://www.brianbondy.com/feeds/rss/${tag}`,
    'site_url': `http://www.brianbondy.com/blog/tagged/${tag}`,
    'image_url': 'http://www.brianbondy.com/img/logo.png',
  });
}


