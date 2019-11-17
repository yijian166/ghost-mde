<style type="text/less">
 @sizeW: 300px;
	.gm-body {
		/* flex: 1;
		display: flex;
		flex-direction: row; */
    overflow: hidden;
		padding-left: @sizeW;

	}
	.gm-sidebar {
		position: absolute;
		top: 0;
		left:0;
		width: 300px;
		height: 100%;
	}
	.gm-content {
		/* flex: 1; */
		height: 100%;
		width: 100%
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
	import { isEditing } from '@store';

  const postList = writable([]);
  let selectedPost;

  function onPostSelect(data) {
		console.log('---onPostSelect--', data.detail, $isEditing);
		if ($isEditing) {
			console.warn('---isEditing--');//TODO:
			return;
		}
    selectedPost = data.detail;
  }
  
  onMount(async () => {
    const api = new GhostAdminApi($$props.blogConfig);
    const { posts, meta } = await api.getPosts();
    postList.set(posts)
		console.log('---GhostAdminApi--', posts, meta)

	});
</script>