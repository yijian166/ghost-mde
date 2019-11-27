import { writable, derived } from 'svelte/store';

export const isEditing = writable(false);
export const ghostApiService = writable(null);
export const postDetail = writable({
  isNew: false,
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
    console.log('---GhostAdminApi--', posts, meta)
    postList.update(data => {
      return {
        ...data,
        list: posts,
        isLoading: false
      }
    })
  }
 
});