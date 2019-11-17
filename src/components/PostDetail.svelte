<style type="text/less">
  @sizePadding: 20px;
  main {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  header {
    height: 50px;
    background-color: #3298dc;
    padding-left: @sizePadding;
    padding-right: @sizePadding;
    display: flex;
    flex-direction: row;
    align-items: center;
    h1 {
      flex: 1;
      color: #fff;
      font-size: 18px;
    }
    input {
      color: #fafafa;
      font-size: 18px;
      border: none;
      height: 36px;
      line-height: 36px;
      box-sizing: border-box;
      padding: 2px 0;
      display: inline-block;
      width: 100%;
      background: transparent;
      outline: none;
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .gm-post-detail-tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: @sizePadding;


    .icon {
      cursor: pointer;
      margin-left: 15px;
      color: darken(#fff, 5%);

      &:hover {
        color: #fff;
      }
    }
  }
  .gm-post-detail {
    /* height: 100%; */
    flex: 1;
    overflow: hidden;
    padding: @sizePadding 0 @sizePadding @sizePadding;
    display: flex;
    flex-direction: column;

  }
  .gm-detail-info {
    margin-bottom: @sizePadding;
  }
  .gm-editor-box {
    flex: 1;
    padding-right: @sizePadding;
  }
  .gm-detail-footer {
    height: 100px;
  }
  .gm-post-html {
    height: 100%;
    padding-right: @sizePadding;
    overflow: auto;
  }
</style>
<main>
  <header >
    <h1>
      {#if isEditing} 
        <input type="text" bind:value={title} />
      {:else}
        {title}
      {/if}
    </h1>
    <div class="gm-post-detail-tools">
      {#if isEditing} 
        <!-- <button class="button is-black is-small">publish</button>     -->
        <div class="dropdown is-hoverable is-right" class:is-active={publihClicked} >
          <div class="dropdown-trigger">
            <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu">
              <span>Publish</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a href="#" class="dropdown-item">
                Save
              </a>
              <a href="#" class="dropdown-item" class:is-active={publihClicked}>
                Publish
              </a>
              <a href="#" class="dropdown-item">
                Cancel Edit
              </a>
            </div>
          </div>
        </div>
        <span class="icon">
          <i class="fas fa-cog"></i>
        </span>
      {:else if $$props.data}
        <button class="button is-small" on:click={doEdit}>Edit</button>
      {/if}
    </div>
  </header>
  <div class="gm-post-detail">
      {#if isEditing} 
        <div class="gm-editor-box">
          <Editor {markdown} {topHeight} {bottomHeight}/>
        </div>
      {:else}
        <div class="gm-post-html">
          <PostPreview {postHTML} />
        </div>
      {/if}
    <!-- <div class="gm-detail-footer">
    </div> -->
  </div>
</main>

<script>
  import { onMount, afterUpdate } from 'svelte';
  import Editor from './Editor.svelte'
  import PostPreview from './PostPreview.svelte'

  // const postType = "scheduled" | "published" | "draft"
  // 编辑与否
  let isEditing = false;
  let publihClicked = false;
  let title = '';
  let markdown;
  const topHeight = 50 + 20;
  const bottomHeight = 0

  $: postHTML = $$props.data && typeof $$props.data === 'object' ? $$props.data.html : ''
  
  function tryEdit() {
    publihClicked = !publihClicked;
  }

  function doEdit() {
    
    try {
      if ($$props.data && typeof $$props.data === 'object') {
        const { mobiledoc = "", title: _title } = $$props.data;
        title = _title;
        const { cards } = JSON.parse(mobiledoc);
        if (Array.isArray(cards) && cards.length) {
          const [ [type, { markdown: _md }] ] = cards;
          // console.log('--', type, markdown)
          if (type === 'markdown') {
            markdown = _md;
            isEditing = true;
          }
        }
        // console.log('--update-', mobiledoc)
      }
      // TODO: 提示不能解析为markdown的情况
    } catch (error) {
      
    }
  }
  
  onMount(() => {
    
  });

  afterUpdate(() => {
   
    
  });
  
</script>