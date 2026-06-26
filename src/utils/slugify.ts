/* eslint-disable no-useless-escape */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()                       // convert to lowercase
    .trim()                               // remove leading/trailing spaces
    .replace(/\s+/g, '-')                 // replace spaces with -
    .replace(/[^\w\-]+/g, '')             // remove all non-word chars
    .replace(/\-\-+/g, '-')               // replace multiple - with single -
    .replace(/^-+/, '')                   // trim - from start
    .replace(/-+$/, '');                  // trim - from end
}