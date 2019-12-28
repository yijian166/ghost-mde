<style type="text/less">
	.gm-icon-link {
		font-size: 13px;
	}
</style>
<ModalBox 
  title="Blog Config" 
  show={$$props.show}
  {isSending}
  on:cancel={cancelAddBlog}
  on:save={saveBlog}
  noCancel={true}
>
  <div>
    <div class="field">
      <label class="label">Blog Url</label>
      <div class="control">
        <input class="input" type="text" placeholder="http://youblog.com" bind:value={url}>
      </div>
    </div>
    <div class="field">
      <label class="label">Ghost Admin API Key <a class="gm-icon-link" target="_bland" href="https://ghost.org/docs/api/v3/admin/#token-authentication"><i class="fas fa-question"></i></a></label>
      <div class="control">
        <input class="input" type="text" placeholder="xxx:xxx" bind:value={key}>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={async}>
          Sync blog admin key to all your Chrome browser
        </label>
      </div>
    </div>
  </div>
</ModalBox>
<script>
  import ModalBox from './ModalBox.svelte'
  import { message, blogConfig } from '@store'
  import { getData, tryGetData, saveData } from '@db'
  import { BlogConfigInfo } from '@api'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let isSending = false;
  let url = '';
	let key = '';
  let async = true;
  
  // $: {
  //   console.log('---re blog config---')
  //   if ($$props.show) {
  //     (async () => {
  //       const {data = false} = await tryGetData('async');
  //       async = data;
  //     })();
  //   }
  // }
  
  function cancelAddBlog() {

	}

	async function saveBlog() {
		if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url)) {
      message.set({
        body: 'Blog Url is invalid',
        type: 'danger'
      });
		  return
		}
    if (!/^[0-9a-zA-Z]+\:[0-9a-zA-Z]+$/.test(key)) {
      message.set({
        body: 'Ghost Admin API Key is invalid, it must be string:string',
        type: 'danger'
      });
		  return
    }

    const asyncData = await saveData('async', async, true);
    const _url = url.endsWith('/')?url.slice(0,url.length -1):url;
    const _blogConfig =  new BlogConfigInfo(_url, key)
    const userData = await saveData('blogInfo',_blogConfig,async);
    await saveData('postList', {posts:[], total:0})
    blogConfig.set(_blogConfig)
    console.log('---', userData)
  }
</script>