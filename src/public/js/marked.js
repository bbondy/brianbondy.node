import marked from 'marked';
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: true,
  gfm: false,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

export default marked;
