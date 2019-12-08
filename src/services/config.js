export const ISDEV = !__buildEnvIsProduction__;
export const EditorSaveInterval = 1000 * 3; //TODO: chenge to 30

export const PostStatus = {
  scheduled: "scheduled",
  published: "published",
  draft: "draft"
};

export const handlePost = item => {
  let markdown = '';
  let supportMd = false;
  if (item && typeof item === 'object') {
    const { mobiledoc = "" } = item;
    const { cards } = JSON.parse(mobiledoc);
    if (Array.isArray(cards) && cards.length) {
      const [ [type, { markdown: _md }] ] = cards;
      // console.log('--', type, markdown)
      if (type === 'markdown' || type === 'card-markdown') {
        markdown = _md;
        supportMd = true;
      }
    }
  }
  item.publishedTime = new Date(item.published_at).toLocaleString()
  item.markdown = markdown;
  item.supportMd = supportMd;
  return item;
}