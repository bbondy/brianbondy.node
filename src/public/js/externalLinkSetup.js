/**
 * Checks for external links and puts target='blank' on the nodes.
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
    }
  }
}
