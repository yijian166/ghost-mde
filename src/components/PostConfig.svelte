<style type="text/less">
  .gm-post-config {
    padding: 20px
  }
  h3 {
    font-size: 20px;
    font-weight: bold;
  }
  .gm-post-config-item {
    padding: 10px 0;
  }
</style>
<div class="gm-post-config">
  <h3>Post Settings</h3>
  <div class="gm-post-config-item">
    <ImgUploader {url} on:change={onHasUrl}/>
  </div>
</div>
<script>
  import ImgUploader from './ImgUploader.svelte'
  import { ghostApiService, postDetail } from '@store'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  $: post = $postDetail ? $postDetail.post : null;
  $: url = post ? ($postDetail.post.feature_image || ''): '';

  // TODO: config change event

  function onHasUrl(url) {
    if (!post) {return}
    postDetail.update(data => {
      return {
        ...data,
        post: {
          ...data.post,
          feature_image: url.detail || ''
        }
      }
    })
  }

</script>