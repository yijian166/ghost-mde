import { writable, get } from 'svelte/store';
import { tick } from 'svelte';

export const ghostApiService = writable(null);
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


export const editorInitValue = writable('')

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