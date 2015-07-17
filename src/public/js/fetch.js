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
export function fetchBlogPosts() {
  // TODO: Add various filters
  return getJSON(`/api/blog`);
}
