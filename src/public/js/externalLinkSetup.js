/**
 * Checks for external links and puts target='blank' on the nodes.
 * This also replaces my own site http links with https if encountered (mainly because of comments in the db)
 * @param e The element to look within
 */
export default function externalLinkSetup (e) {
  if (!document.querySelectorAll || !Array.prototype.forEach) {
    return
  }

  let links = e.querySelectorAll('a')
  for (var i = 0; i < links.length; i++) {
    let a = links[i]
    let reCurrentHost = new RegExp('/' + window.location.host + '/')
    if (!reCurrentHost.test(a.href)) {
      a.setAttribute('target', 'blank')
    } else if (a.href.indexOf('http://brianbondy.com') === 0 || a.href.indexOf('http://www.brianbondy.com') === 0) {
      a.href = a.href.replace('http://', 'https://')
    }
  }
}
