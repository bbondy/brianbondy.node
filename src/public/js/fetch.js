let getByType = (type, url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = type;
    xhr.onload = () => {
      var status = xhr.status;
      resolve(xhr.response, status);
    };
    xhr.onerror = e => reject(e);
    xhr.send();
  });
};

let getJSON = getByType.bind(null, 'json');
let getText = getByType.bind(null, 'text');
let getHtml = getText;

/**
 * Fetch a single blog post
 */
export function fetchBlogPost(id) {
  return getJSON(`/api/blog/${id}`);
}

/**
 * Fetch a single markdown path
 */
export function fetchMarkdown(id) {
  return getText(`/markdown/${id}`);
}

/**
 * Fetch a single html fragment page
 */
export function fetchHtml(id) {
  return getHtml(`/html/${id}`);
}

/**
 * Fetch a bunch of blog posts
 */
export function fetchBlogPosts(filter) {
  let urlParams = '';
  if (filter.page) {
    urlParams = `?page=${filter.page}`;
  }
  if (filter && filter.year) {
    return getJSON(`/api/blog/posted/${filter.year}${urlParams}`);
  } else if (filter && filter.tag) {
    return getJSON(`/api/blog/tagged/${filter.tag}${urlParams}`);
  }
  return getJSON(`/api/blog${urlParams}`);
}

/**
 * Fetch a list of tags
 */
export function fetchTags() {
  return getJSON('/api/tags');
}

