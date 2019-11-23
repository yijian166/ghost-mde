import getToken from './tooken';
import { ISDEV } from '@config';

export default async function request(resourceType, blogConfig, {params = {},data = {}, method = "POST", header = {}, formData} = {}) {
  let url = `${!ISDEV ? blogConfig.url : ''}/ghost/api/${blogConfig.version}/admin/${resourceType}/`;
  url += "?";
  url += Object.keys(params).reduce((list, key) => {
    const val = encodeURIComponent([].concat(params[key]).join(','));
    return list.concat(`${key}=${val}`);
  }, []).join('&');
  const result = await fetch(url,{
    method,
    ...(method !== 'GET' ? {body: formData ? formData : JSON.stringify(data)}:{}),
    headers: new Headers({
      // 'Content-Type': 'application/json',
      ...header,
      Authorization: `Ghost ${getToken(blogConfig.key, blogConfig.version)}`
    })
  });

  const returnData = await result.json();
  return returnData;
}