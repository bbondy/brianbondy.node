var getJSON = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = () => {
      var status = xhr.status;
      resolve(xhr.response, status);
    };
    xhr.onerror = e => reject(e);
    xhr.send();
  });
};

var getText = url => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'text';
    xhr.onload = () => {
      var status = xhr.status;
      resolve(xhr.response, status);
    };
    xhr.onerror = e => reject(e);
    xhr.send();
  });
};


/**
 * Fetch a single blog post
 */
export function fetchBlogPost(id) {
  return getJSON(`/api/blog/${id}`);
}

/**
 * Fetch a single blog post
 */
export function fetchMarkdown(id) {
  return getText(`/markdown/${id}`);
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

