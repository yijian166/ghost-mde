import { writable, get } from 'svelte/store';

export const ghostApiService = writable(null);
export const initPostDetail = {
  isSending: false,
  isEditing: false,
  isConfiging: true,
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