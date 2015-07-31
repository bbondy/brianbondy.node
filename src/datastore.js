let redis = require('redis');

let redisClient;
export function init(port) {
  redisClient = redis.createClient(port);
  redisClient.on('error', function (err) {
    console.error('DB: Error ' + err);
  });
}

/**
 * Adds an object to a list
 */
function pushToList(key, obj) {
  return new Promise((resolve, reject) => {
    redisClient.rpush(key, JSON.stringify(obj), err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Obtains all items in a list
 */
function getListElements(key) {
  return new Promise((resolve, reject) => {
    redisClient.lrange(key, 0, -1, (err, replies) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(replies.map(result => JSON.parse(result.toString())));
    });
  });
}

/**
 * Adds the specified commment to the DB to the location comments:{blogPostId}
 *
 * Comments typically contain:
 *   - name
 *   - email
 *   - homepage
 *   - body
 *   - datePosted
 */
export function addComment(blogPostId, comment) {
  comment.datePosted = new Date().toISOString();
  return pushToList(`comments:${blogPostId}`, comment);
}

/**
 * Obtains a list of comments for the specified blogPostId
 * See addComment for the data stored for each comment.
 */
export function getComments(blogPostId) {
  return getListElements(`comments:${blogPostId}`);
}
