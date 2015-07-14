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

export function fetchBlogPost(id) {
  return getJSON(`/api/blog/${id}`);

}
