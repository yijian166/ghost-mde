<style type="text/less">
	.box {
		p {
				border-bottom: 1px solid  red;
		}
	}
</style>
<!-- <style global type="text/less">
  html, body {
    height: 100%;
  }
</style>  -->
<div class="box"><p>ss</p></div>

<script>
	import { onMount } from 'svelte';
	import GhostAdminApi, { ISDEV } from '@api'

	const blogConfig = {
		url: 'https://hicc.me',
		key: '5dc6bb0c86f77b000148a666:6681969450497e6feec80a9871ced1d26ff4bdd984d0c378f88c3eb1b599c3a1',
		version: "v3"
	}

	const api = new GhostAdminApi(blogConfig);

	onMount(async () => {
	
		
		const result = await api.getPosts();
		console.log('--', result, ISDEV)

	});
	let name = 'world';
</script>