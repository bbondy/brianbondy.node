let getByType = (method, type, requestContentType, postData, url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.responseType = type;
    if (requestContentType) {
      xhr.setRequestHeader('Content-Type', requestContentType);
    }
    xhr.onload = () => {
      // var status = xhr.status;
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.status);
      }
    };
    xhr.onerror = e => reject(e);
    if (postData &&
        requestContentType === 'application/json' &&
        typeof postData === 'object') {
      xhr.send(JSON.stringify(postData));
    } else if (postData) {
      xhr.send(postData);
    } else {
      xhr.send();
    }
  });
};

let getJSON = getByType.bind(null, 'GET', 'json', undefined, undefined);
let postJSON = getByType.bind(null, 'POST', 'json', 'application/json');
let getText = getByType.bind(null, 'GET', 'text', undefined, undefined);
let deleteJSON = getByType.bind(null, 'DELETE', 'json', 'application/json');
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

/**
 * Fetch a list of comments
 */
export function fetchComments(blogPostId) {
  return getJSON(`/api/blog/${blogPostId}/comments`);
}

/**
 * Fetches a captcha image and sets an encrypted cookie
 * which we'll pass back.
 */
export function fetchCaptcha(blogPostId) {
  return getText(`/api/captcha/${blogPostId}`);
}

/**
 * Post a comment
 */
export function postComment(blogPostId, comment) {
  return postJSON(comment, `/api/blog/${blogPostId}/comments`);
}

/**
 * Delete a comment
 */
export function deleteComment(blogPostId, comment) {
  return deleteJSON(comment, `/api/blog/${blogPostId}/comment?adminModePass=${window.adminModePass}`);
}
