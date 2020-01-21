import { writable, get, derived,readable } from 'svelte/store';
import { tick } from 'svelte';
import GhostAdminApi, { BlogConfigInfo } from '@api';
import { EditorSaveInterval, handlePost } from '@config';
import pick from 'lodash/pick';
import { PostStatus } from './config';

export const editor = writable();
export const blogConfig = writable(new BlogConfigInfo());
export const ghostApiService = derived(blogConfig, ($blogConfig, set) => {
  console.warn('---blogConfig changed--', $blogConfig.hasConfig)
  document.title = `Ghost-MDE ${($blogConfig.showUrl || '')}`
  set(new GhostAdminApi(new BlogConfigInfo($blogConfig.url, $blogConfig.key)))
}, new GhostAdminApi(new BlogConfigInfo()));

export const initPostDetail = {
  isSending: false,
  isEditing: false,
  isConfiging: false,
  isPublishing: false,
  post: null
};
export const postDetail = writable(initPostDetail)

export const postListEvent = writable(null);

export const postList = writable({
  isLoading: false,
  list: [],
  total: 0,
  page: 1,
  limit: 20
});
const tagRefreshToken = writable(0);
export const tagList = derived([ghostApiService,tagRefreshToken], async ([$api],set) => {
  if (!$api || !$api.hasApi) {
    return set({list:[]})
  } else {
    const list = await $api.getTags()
    set({list});
  }
}, {list: []});


// 这里使用对象，而不是字符串，
// 是为了避免两次同时打开一个文章但是store不触发的问题（因为Svelte，store特性，会过滤相同值)
export const editorInitValue = writable({markdown: ''}) 

export const confirmModal = writable({})

export const message = writable({});

export const quitEdit = (useQuit = true) => {
  return new Promise((resolve) => {
    const _postDetal = get(postDetail)
    if (_postDetal && _postDetal.post && _postDetal.post.status === PostStatus.draft) {
      saveOrPublish()// draft 状态的退出后直接保存文章
      resolve(true);
      return 
    }
    if (!_postDetal || !_postDetal.isEditing) {
      resolve(true);
      return
    }
    confirmModal.set({
      isQuit: true,
      title: useQuit ? 'Are you sure you want to quit edit this post?' : 'Is editing post, are you sure to quit?',
      body: `Quit Edit. Please make sure saved your content first!`,
      confirmText: 'Quit',
      cancelFun: async () => {
        resolve(false)
      },
      asyncFun: async () => {
        postDetail.set(initPostDetail)
        await tick()
        resolve(true)
        return true
      }
    })
  })
}

export const supportEditKeys = ['id', 'feature_image', 'slug', 'updated_at', 'status','visibility','tags']

export async function saveOrPublish(toStatus, published_at) {
  let newPost;
  const _postDetail = get(postDetail);
  const _ghostApiService = get(ghostApiService);
  const _editor = get(editor)
  const selectedPost = _postDetail ? _postDetail.post : null;
  const isEditing = _postDetail && _postDetail.isEditing;
  const title = selectedPost ? selectedPost.title : '';
  try {
    if (!_editor || !isEditing || (selectedPost && selectedPost.status === _ghostApiService.postStatus.scheduled && !published_at)) {
      return;
    }
    postDetail.update(data => {
      return {
        ...data,
        isSending:true,
      }
    })
    if (Array.isArray(selectedPost.tags)) {
      const hasNewTag = selectedPost.tags.some(item => typeof item.id === 'symbol');
      if (hasNewTag) {
        console.log('---tagRefreshToken update---')
        tagRefreshToken.update(token=>token + 1)
      }
    }
    const md = _editor.value();
    const status = toStatus ? toStatus : (selectedPost || {}).status || _ghostApiService.postStatus.draft;
    const post = {
      title,
      ...pick(selectedPost || {}, supportEditKeys),
      status,
      ...(status === _ghostApiService.postStatus.scheduled ? {published_at: new Date(published_at)}:{}) // scheduled 情况下， published_at 应该需要存在
    }
    console.log('---saveOrPublish start api call----',post)
    const data = await _ghostApiService.savePost(post, md);
    newPost = handlePost(data);
    
    postList.update(postListData => {
      const list = selectedPost && selectedPost.id ? postListData.list.map(item => {
        if (item.id === newPost.id) {
          return newPost
        }
        return {...item}
      }):  [newPost,...postListData.list]
      console.log('---postList.update---', list)
      
      return {
        ...postListData,
        list
      }
    })
    console.log('---saveOrPublish---', newPost, newPost.updated_at);
    return newPost;
  } catch (error) {
    // TODO: 处理接口失败的情况
    console.log('---saveOrPublish error---', error);
    let code = ''
    let msg = 'post save failed'
    if (Array.isArray(error) && error.length > 0) {
      code = error[0].code;
      msg = error[0].message;
    }
    message.set({
      body: msg,
      type: 'danger'
    })

    // 409 Conflict code === "UPDATE_COLLISION"
    // 1. 每次更新的时候，传的是上次拿到的updated_at time
    // 2. 如果接口冲突说明，说明别人比你拿到了更新的server端 updated_at time 这样也就是冲突了
    // 3. 提示用户推出编辑，拉取一封最新的post信息
    // 4. 因此这里是实际上是一种抢占式的，防冲突策略
  } finally {
    postDetail.update(value => {
      const ob = {}
      if (newPost) {
        if(selectedPost) {
          ob.post = newPost
        } else {
          ob.post = {
            ...value.post,
            ...pick(newPost, supportEditKeys.concat(['html']))
          }
        }
      }
      return {
        ...value,
        isSending:false,
        ...ob
      }
    });
  }
}