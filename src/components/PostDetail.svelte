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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
    position: relative;
    z-index: 1;
  }
  .gm-editor-config {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 2;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    /* box-shadow: -1px 3px 3px rgba(0, 0, 0, 0.2); */
  }
  .gm-post-box {
    max-width: 800px;
    height: 100%;
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
  .icon {
    user-select: none;
  }
</style>
<main>
  <header >
    <h1>
      {#if isEditing } 
        <input type="text" bind:value={title} />
      {:else}
        {title}
      {/if}
    </h1>
    <div class="gm-post-detail-tools">
      {#if isEditing || selectedPost}
        {#if isEditing } 
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
                <a href="#" class="dropdown-item" class:is-active={publihClicked} on:click|preventDefault={saveOrPublish}>
                  Publish
                </a>
                <a href="#" class="dropdown-item" on:click|preventDefault={cancelEdit}>
                  Cancel Edit
                </a>
              </div>
            </div>
          </div>
        {:else if canEdit}
          <!-- <button class="button is-small" on:click={doEdit}>Edit</button> -->
          <span class="icon" on:click={doEdit}>
            <i class="fas fa-pen-nib"></i>
          </span>
        {/if}
        <span class="icon" on:click={configToggle}>
          <i class="fas fa-cog"></i>
        </span>
      {/if}
    </div>
  </header>
  <div class="gm-post-detail" >
    <div class="gm-post-box" >
      {#if isEditing } 
        <div class="gm-editor-box">
          <Editor {markdown} {topHeight} {bottomHeight} {fileUploadFun} on:open="{onHasEditor}" on:close="{onEditorClose}"/>
        </div>
      {:else}
        <div class="gm-post-html">
          <PostPreview {postHTML} />
        </div>
      {/if}
    </div>
     
    <div class="gm-editor-config" style="{configPageStyle}">
      <PostConfig />
    </div>
    <!-- <div class="gm-detail-footer">
    </div> -->
  </div>
</main>

<script>
  import { onMount, afterUpdate } from 'svelte';
  import Editor from './Editor.svelte'
  import PostPreview from './PostPreview.svelte'
  import PostConfig from './PostConfig.svelte'
  import { writable, derived } from 'svelte/store';
  import { ghostApiService, postDetail, postList } from '@store'
  import { EditorSaveInterval } from '@config';

  // const postType = "scheduled" | "published" | "draft"
  // 编辑与否
  let publihClicked = false;
  let title = '';
  const topHeight = 50 + 20;
  const configWidth = 320;
  const maxEditorWidth = 800;
  const bottomHeight = 0;
  let editor = writable();
  let markdown = '';

  // $: selectedPost = $postDetail ? $postDetail.post ? $postDetail.post: {} : {};
  $: selectedPost = $postDetail ? $postDetail.post : null;
  $: canEdit = $postDetail && $postDetail.post;
  $: postHTML = selectedPost && typeof selectedPost === 'object' ? selectedPost.html : '';
  $: _markdown = selectedPost && typeof selectedPost === 'object' ? selectedPost.markdown : '';
  $: supportMd = selectedPost && typeof selectedPost === 'object' ? !!selectedPost.supportMd : false; 
  $: isEditing = $postDetail  && $postDetail.isEditing;
  $: isSending = $postDetail  && $postDetail.isSending;
  $: isConfiging = $postDetail  && $postDetail.isConfiging;

  $: configPageStyle = `width:${configWidth}px;right: ${isConfiging ? 0:-configWidth}px`

  // TODO: feature_image
  

  const editorValue = derived(editor, ($editor, set) => {
    console.log('--editor--', $editor)
    if (!$editor){ return }
    let isFirst = true;
    const interval = setInterval(() => {
      console.log('--interval ing--', !!$editor, $editor.value().length)
      if ($editor && (!selectedPost || selectedPost && !isFirst) && !isSending) {
        // if (selectedPost && selectedPost)
        // TODO: 忽略第一次打开编辑器的触发
        set($editor.value())
      }
      isFirst = false;
    }, EditorSaveInterval);
    return () => {
      console.log('--clearInterval--')
      interval && clearInterval(interval)
    }
  }, '');

  const editorValueUnSub =  editorValue.subscribe(async value=> {
    console.log('--editorValue--', value.length)
    // if (!selectedPost || Object.keys(selectedPost).length === 0) {
    //   // 新建文章
    // }
    await saveOrPublish();
  });
  
  function cancelEdit() {
    //TODO: re confirm cancel Edit
    console.log('---cancelEdit---')
    // publihClicked = false;
    postDetail.update(data => {
      return {
        ...data,
        isEditing:false
      }
    })
  }

  function configToggle() {
    postDetail.update(data => {
      return {
        ...data,
        isConfiging: !data.isConfiging
      }
    })
  }
  
  function onHasEditor(e) {
    console.log('--onHasEditor--',e)
    editor.set(e.detail);
  }
  function onEditorClose() {
    console.log('--onEditorClose--',editor)
    editor.set(null);
  }

  function doEdit() {
    console.log('---doEdit---')
    if (!supportMd) {
      // TODO: 提示不能解析为markdown的情况
      console.warn('---no support---')
      return;
    }
    markdown = _markdown;
    title = selectedPost ? selectedPost.title : '';
    console.log('---doEdit---')
    postDetail.update(data => {
      return {
        ...data,
        isEditing:true
      }
    })
  }
  
  async function saveOrPublish() {
    if (!$editor) {
      return;
    }
    postDetail.update(data => {
      return {
        ...data,
        isSending:true
      }
    })
    const md = $editor.value();
    const post = {
      title,
      id: selectedPost ?selectedPost.id: ''
    }
    const data = await $ghostApiService.savePost(post, md, selectedPost ? selectedPost.updated_at: '');
    
    if (!data) {
      // TODO: 处理接口失败的情况

      //TODO: 409 Conflict 
      // 1. 每次更新的时候，传的是上次拿到的updated_at time
      // 2. 如果接口冲突说明，说明别人比你拿到了更新的server端 updated_at time 这样也就是冲突了
      // 3. 提示用户推出编辑，拉取一封最新的post信息
      // 4. 因此这里是实际上是一种抢占式的，防冲突策略
    }

    postDetail.update(value => {
      return {
        ...value,
        isSending:false,
        ...(!selectedPost ? {
          post: data,
        }: {
          post: {
            ...value.post,
            updated_at: data.updated_at
          }
        })
      }
    });
    if (!selectedPost) {
      // 表示是新增
      postList.update(postListData => {
        return {
          ...postListData,
          list: [data,...postListData.list]
        }
      })
    }
    
    console.log('---saveOrPublish---', data);
    return data;
  }

  async function fileUploadFun(file) {
    console.log('---fileUploadFun---', file)
    let url = '';
    if ($ghostApiService) {
      url = await $ghostApiService.uploadImg(file);
      console.log('---fileUploadFun upload ---', url)
    }
    // TODO: url empty message
    return url
  }
  
  onMount(() => {
    return () => {
      editorValueUnSub();
      postDetailUnSub();
    }
  });

  afterUpdate(() => {
   
    
  });
  
</script>