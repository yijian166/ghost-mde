<style type="text/less">
	.gm-container {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
</style>

<div class="gm-container">
	<Container {blogConfig}/>
	<ModalBox 
		title="Blog Config" 
		show={!hasBlogConfig}
		{isSending}
	>
		<div>
			<div class="field">
				<label class="label">Blog Url</label>
				<div class="control">
					<input class="input" type="text" placeholder="http://youblog.com">
				</div>
			</div>
			<div class="field">
				<label class="label">Ghost Admin API Key</label>
				<div class="control">
					<input class="input" type="text" placeholder="xxx:xxx">
				</div>
			</div>
		</div>
	</ModalBox>
</div>
<script>

	import { writable } from 'svelte/store';
	import Container from './components/Container.svelte';
	import ModalBox from './components/ModalBox.svelte'
	const blogConfig = {
		// url: 'https://hicc.me',
		// key: '5dc6bb0c86f77b000148a666:6681969450497e6feec80a9871ced1d26ff4bdd984d0c378f88c3eb1b599c3a1',
		// version: "v3"
	}
	let isSending = false;

	$: hasBlogConfig = typeof blogConfig === 'object' && Object.keys(blogConfig).length > 0



	const count = writable(0);


	let name = 'world';
</script>