import { writable } from 'svelte/store';

export const isEditing = writable(false);
export const ghostApiService = writable(null);
export const postDetail = writable({
  isNew: false,
  post: null
})

