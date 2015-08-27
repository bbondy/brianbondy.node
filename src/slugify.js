export default function slugify(str) {
  return str.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}
