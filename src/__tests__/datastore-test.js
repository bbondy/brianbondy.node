/* global describe, it, jest, expect, waitsFor */
jest.autoMockOff()

const {initRedis, uninitRedis, addComment, getComments} = require('../datastore.js')

const testComments = [{
  name: 'Brian',
  email: 'fake-email@gmail.com',
  website: 'https://brianbondy.com',
  body: 'test message'
}, {
  name: 'Shannon',
  email: 'hello-email@gmail.com',
  website: 'https://brianbondy.com/blog',
  body: 'test message2',
  datePosted: new Date().toISOString()
}, {
  name: 'RonnieLinkAsher',
  email: 'kids-email@gmail.com',
  website: 'https://brianbondy.com/blog/page/1',
  body: 'test message3',
  datePosted: new Date().toISOString()
}]
describe('datastore.js', function () {
  it('Can init redis', function () {
    initRedis()
  })

  it('can add comments', function () {
    var commentAdded = false
    waitsFor(() => {
      return commentAdded
    })
    addComment(33, testComments[0]).then(() => {
      commentAdded = true
    })
  })

  it('can get comments', function () {
    var gotResults = false
    waitsFor(() => {
      return gotResults
    })
    getComments(33).then((results) => {
      expect(results.length).toBe(1)
      expect(results[0]).toEqual(testComments[0])
      gotResults = true
    })
  })

  it('can get an entry with 0 comments', function () {
    var gotResults = false
    waitsFor(() => {
      return gotResults
    })
    getComments(90210).then((results) => {
      expect(results.length).toBe(0)
      gotResults = true
    })
  })

  it('can add a second comment to a single blog post', function () {
    var commentAdded = false
    waitsFor(() => {
      return commentAdded
    })
    addComment(33, testComments[1]).then(() => {
      commentAdded = true
    })
  })

  it('can add a comment to a different blog post', function () {
    var commentAdded = false
    waitsFor(() => {
      return commentAdded
    })
    addComment(34, testComments[2]).then(() => {
      commentAdded = true
    })
  })

  it('can get comments returns distinct entries for each blog post', function () {
    var gotResults1 = false
    var gotResults2
    waitsFor(() => {
      return gotResults1 && gotResults2
    })
    getComments(33).then((results) => {
      expect(results.length).toBe(2)
      expect(results[0]).toEqual(testComments[0])
      expect(results[1]).toEqual(testComments[1])
      gotResults1 = true
    })

    getComments(34).then((results) => {
      expect(results.length).toBe(1)
      expect(results[0]).toEqual(testComments[2])
      gotResults2 = true
    })
  })

  it('Can uninit redis', function () {
    uninitRedis(true)
  })
})
