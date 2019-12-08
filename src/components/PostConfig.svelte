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
    <ImgUploader url={feature_image} on:change={e => onInputChange('feature_image', e.detail)}/>
  </div>
  <div class="gm-post-config-item">
    <PostSlug {slug} on:change={e => onInputChange('slug', e.detail)}/>
  </div>
</div>
<script>
  import ImgUploader from './ImgUploader.svelte'
  import PostSlug from './PostSlug.svelte'
  import { ghostApiService, postDetail } from '@store'
  import { createEventDispatcher, tick } from 'svelte';
  const dispatch = createEventDispatcher();
  $: post = $postDetail ? $postDetail.post : null;
  $: feature_image = post ? ($postDetail.post.feature_image || ''): '';
  $: slug = post ? ($postDetail.post.slug || ''): '';

  async function onInputChange(key, value) {
    if (!post) {return}
    postDetail.update(data => {
      return {
        ...data,
        post: {
          ...data.post,
          [key]: value
        }
      }
    });
    await tick();
    dispatch('change')
  }

</script>