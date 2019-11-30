import { writable, derived } from 'svelte/store';

export const ghostApiService = writable(null);
export const postDetail = writable({
  isSending: false,
  isEditing:false,
  post: null
})

export const postListEvent = writable(null);

export const postList = writable({
  isLoading: false,
  list: [],
  total: 0,
  offset: 0,
  limit: 20
});

ghostApiService.subscribe(async api => {
  console.log('---ghostApiService has value--', api)
  if (!api) {
    postList.update(data => {
      return {
        ...data,
        list: [],
      }
    })
  } else {
    postList.update(data => {
      return {
        ...data,
        isLoading: true,
      }
    })
    const { posts, meta } = await api.getPosts();
    const sitConfig = await api.getSiteConfig();
    console.log('---GhostAdminApi--', posts, meta, sitConfig)
    postList.update(data => {
      return {
        ...data,
        list: posts,
        isLoading: false
      }
    })
  }
 
});