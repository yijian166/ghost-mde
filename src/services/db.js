export const getData = (key, isAsync = false) => {
  return new Promise((resolve, reject) => {
    if (!chrome || !chrome.storage) { 
      resolve({isOk:false, msg: 'Not in chrome extension'})
     }
    (isAsync ? chrome.storage.sync : chrome.storage.local).get([key], function(result) {
      console.log(`Value ${ key } from ${isAsync ? 'sync': 'local'} currently is `,result, chrome.runtime);
      if (chrome.runtime.error ){
        resolve({isOk:false, msg: chrome.runtime.error})
      }else if (result[key] === undefined) {
        resolve({isOk:false})
      }else {
        resolve({isOk:true, data: result[key]})
      }
    })
  })
}

export const tryGetData = async key => {
  let result = await getData(key, true)
  if (!result.isOk) {
    result = await getData(key)
  }
  return result;
}

export const saveData  = (key, value, isAsync = false) => {
  return new Promise((resolve, reject) => {
    if (!chrome) { 
      resolve({isOk:false, msg: 'Not in chrome extension'})
     }
    (isAsync ? chrome.storage.sync : chrome.storage.local).set({[key]: value}, function(result) {
      console.log('Value is set to ',key,value, chrome.runtime);
      if (chrome.runtime.error ){
        resolve({isOk:false, msg: chrome.runtime.error})
      }else {
        resolve({isOk:true})
      }
    })
  })
}