var fs = require('fs');
var RSS = require('rss');
var _ = require('underscore');

import marked from './marked.js';
import {feedItemFromBlogPost, newFeedFromTag} from './helpers.js';

export let blogPosts, blogPostsByYear, blogPostsByTag, rssByTag, feed, resumeHTML, tags = {};

export function reloadData() {
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
  resumeHTML = '<html><head><link rel="stylesheet" type="text/css" href="/css/resume.css"></head><body>' +
    marked(fs.readFileSync(`${__dirname}/public/markdown/resume.markdown`, 'utf-8')) + '<body></html>';
}
reloadData();
