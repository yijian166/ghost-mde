<style type="text/less">
	.gm-body {
		flex: 1;
		display: flex;
		flex-direction: row;
    overflow: hidden;
	}
	.gm-sidebar {
		width: 300px;
		height: 100%;
	}
	.gm-content {
		flex: 1;
		height: 100%;
	}
</style>
<div class="gm-body">
		<div class="gm-sidebar">
			<PostsList data={$postList} on:select="{onPostSelect}"/>
		</div>
		<div class="gm-content">
			<PostDetail data={selectedPost} />
		</div>
</div>

<script>
	import PostsList from './PostsList.svelte'
  import PostDetail from './PostDetail.svelte'
  import GhostAdminApi from '@api';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const postList = writable([]);
  let selectedPost;

  function onPostSelect(data) {
    console.log('---', data.detail);
    selectedPost = data.detail;
  }
  
  onMount(async () => {
    const api = new GhostAdminApi($$props.blogConfig);
    const { posts, meta } = await api.getPosts();
    postList.set(posts)
		console.log('--', posts, meta)

	});
</script>