import { writable, get, derived,readable } from 'svelte/store';
import { tick } from 'svelte';
import GhostAdminApi, { BlogConfigInfo } from '@api';

export const blogConfig = writable(new BlogConfigInfo());
export const ghostApiService = derived(blogConfig, ($blogConfig, set) => {
  console.warn('---blogConfig changed--', $blogConfig.hasConfig)
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

// 这里使用对象，而不是字符串，
// 是为了避免两次同时打开一个文章但是store不触发的问题（因为Svelte，store特性，会过滤相同值)
export const editorInitValue = writable({markdown: ''}) 

export const confirmModal = writable({})

export const message = writable({});

export const quitEdit = (useQuit = true) => {
  return new Promise((resolve) => {
    const _postDetal = get(postDetail)
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