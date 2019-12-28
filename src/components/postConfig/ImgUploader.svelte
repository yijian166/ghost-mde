<style type="text/less">
  .gm-box {
    padding-bottom: 9 / 16 *  100%;
    position: relative;
    z-index: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #fafafa;
    border-radius: 2px;

    .gm-img {
      display: none;
    }

    &.has-img {
      .gm-img {
        display: block;
      }
      .gm-img-uploader {
        display: none;
      }
    }
  }
  .gm-img {
  
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .gm-img,
  .gm-img-uploader {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .gm-img-rm {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background: rgba(0,0,0,.6);
    border-radius: 4px;
    box-shadow: 0 0 0 1px hsla(0,0%,100%,.2);
    cursor: pointer;

    .icon {
      color: #fff;
      font-size: 12px;
    }
  }
  .gm-img-uploader {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
</style>
<div class="gm-box" class:has-img={hasImg}>
  <div class="gm-img" style="background-image: url({$$props.url})">
    <button class="gm-img-rm" on:click={rmUrl}>
      <span class="icon is-small" >
        <i class="fas fa-trash-alt" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="gm-img-uploader">
    <button class="button is-info is-outlined is-small" class:is-loading={isSending} on:click={() => fileInput.click()}>Upload post image</button>
    <input bind:this={fileInput} on:change={fileUploadFun} type="file" accept="image/x-png,image/gif,image/jpeg" hidden/>
  </div>
</div>
<script>
  import { ghostApiService } from '@store'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  let fileInput;
  let isSending = false;
  $: hasImg = !!$$props.url;
  
  function rmUrl() {
    dispatch('change', '')
  }

  async function fileUploadFun(e) {
    const target = e.target;
    const files = target.files;
    if (!files || files.length <= 0) {
      return;
    }
    isSending = true;
    const file = files[0];
    console.log('---fileUploadFun---', file)
    let url = '';
    if ($ghostApiService.hasApi) {
      url = await $ghostApiService.uploadImg(file);
      console.log('---fileUploadFun upload ---', url)
    }
    // TODO: url empty message
    isSending = false;
    dispatch('change', url)
  }
</script> 