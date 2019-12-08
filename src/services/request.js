import getToken from './tooken';
import { ISDEV } from '@config';

export default async function request(resourceType, blogConfig, {params = {},data = {}, method = "POST", header = {}, formData} = {}) {
  let url = `${!ISDEV ? blogConfig.url : ''}/ghost/api/${blogConfig.version}/admin/${resourceType}/`;
  url += Object.keys(params).length > 0 ? "?" : "";
  url += Object.keys(params).reduce((list, key) => {
    const val = encodeURIComponent([].concat(params[key]).join(','));
    return list.concat(`${key}=${val}`);
  }, []).join('&');
  const result = await fetch(url,{
    method,
    ...(method !== 'GET' && method !== 'DELETE' ? {body: formData ? formData : JSON.stringify(data)}:{}),
    headers: new Headers({
      ...(resourceType === 'images/upload' ? {}:{'Content-Type': 'application/json; charset=utf-8'}),
      ...header,
      Authorization: `Ghost ${getToken(blogConfig.key, blogConfig.version)}`
    })
  });
  if (method === 'DELETE') {
    return {}
  }
  const returnData = await result.json();
  return returnData;
}