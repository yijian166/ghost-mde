<style type="text/less">
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="container is-widescreen is-fullhd">
	<div class="navbar"></div>
	<Container {blogConfig}/>
</div>


<script>

	import { writable } from 'svelte/store';
	import Container from './components/Container.svelte';

	const count = writable(0);

	const blogConfig = {
		url: 'https://hicc.me',
		key: '5dc6bb0c86f77b000148a666:6681969450497e6feec80a9871ced1d26ff4bdd984d0c378f88c3eb1b599c3a1',
		version: "v3"
	}

	let name = 'world';
</script>