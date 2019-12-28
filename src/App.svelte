<style type="text/less">
	.gm-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="gm-container">
	<Container />
	<BlogConfig show={showBlogConfigModal} {reConfig}/>
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

	let isGetting = true;
	let reConfig = false;

	$: hasBlogConfig = typeof $blogConfig === 'object' && $blogConfig.hasConfig;
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
				blogConfig.set(new BlogConfigInfo(useData.data.url, useData.data.key));
			}
			const asyncData = await tryGetData('async');
			console.log('---useData---', useData, asyncData)
		} catch (error) {
			
		}finally {
			isGetting = false;
		}
		
		
	})
</script>