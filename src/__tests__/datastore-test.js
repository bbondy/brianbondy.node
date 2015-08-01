jest.autoMockOff();

const redis = require('redis');

const {initRedis, uninitRedis, addComment, getComments} = require('../datastore.js');

const testComments = [{
  name: 'Brian',
  email: 'fake-email@gmail.com',
  homepage: 'http://www.brianbondy.com',
  body: 'test message',
}, {
  name: 'Shannon',
  email: 'hello-email@gmail.com',
  homepage: 'http://www.brianbondy.com/blog',
  body: 'test message2',
  datePosted: new Date().toISOString(),
}];


describe('datastore.js', function() {
    it('Can init redis', function() {
      initRedis();
    });

    it('can add comments', function() {
      var commentAdded = false;
      waitsFor(() => {
        return commentAdded;
      });
      addComment(33, {
        name: 'Brian',
        email: 'fake-email@gmail.com',
        homepage: 'http://www.brianbondy.com',
        body: 'test message',
      }).then(() => {
        commentAdded = true;
      });
    });

    it('can get comments', function() {
      var gotResults = false;
      waitsFor(() => {
        return gotResults;
      });
      getComments(33).then((results) => {
        expect(results.length).toBe(1);
        expect(results[0]).toEqual(testComments[0]);
        gotResults = true;
      });
    });

    it('can get an entry with 0 comments', function() {
      var gotResults = false;
      waitsFor(() => {
        return gotResults;
      });
      getComments(90210).then((results) => {
        expect(results.length).toBe(0);
        gotResults = true;
      });
    });

    it('Can uninit redis', function() {
      uninitRedis(true);
    });
});
