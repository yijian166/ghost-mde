<style type="text/less">
	.gm-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="gm-container">
	<Container />
	<BlogConfig show={showBlogConfigModal}/>
</div>
<script>

	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import Container from './components/Container.svelte';
	import ModalBox from './components/ModalBox.svelte'
	import BlogConfig from './components/BlogConfig.svelte'
	import { getData, tryGetData } from '@db'
	import { blogConfig } from '@store';
	import { BlogConfigInfo } from '@api'

	// let blogConfig = {
	// 	url: 'https://hicc.me',
	// 	key: '5dc6bb0c86f77b000148a666:6681969450497e6feec80a9871ced1d26ff4bdd984d0c378f88c3eb1b599c3a1',
	// 	version: "v3"
	// }
	let isGetting = true;

	$: hasBlogConfig = typeof $blogConfig === 'object' && Object.keys($blogConfig).length > 0;
	$: showBlogConfigModal = !isGetting && !hasBlogConfig

	const count = writable(0);


	let name = 'world';

	onMount(async () => {
		console.log('---check chrome ---', chrome)
		// const data = await getData('async')
		
		try {
			isGetting = true;
			const useData = await tryGetData('blogInfo');
			if (useData.isOk && useData.data) {
				blogConfig.set({
					url: useData.data.url,
					key: useData.data.key,
					version: "v3"
				});
			}
			const asyncData = await tryGetData('async');
			console.log('---useData---', useData, asyncData)
		} catch (error) {
			
		}finally {
			isGetting = false;
		}
		
		
	})
</script>