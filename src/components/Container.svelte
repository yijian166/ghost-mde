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
			<PostsList />
		</div>
		<div class="gm-content">
			<PostDetail />
		</div>
</div>

<script>
	import PostsList from './PostsList.svelte'
  import PostDetail from './PostDetail.svelte'
  import GhostAdminApi from '@api';
  import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ghostApiService } from '@store';
	
  
  onMount(() => {
		const api = new GhostAdminApi($$props.blogConfig);
		ghostApiService.set(api);
	});
</script>