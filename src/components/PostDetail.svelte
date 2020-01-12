<style type="text/less">
  @sizePadding: 20px;
  @topH: 50px;
  main {
    height: 100%;
    overflow: hidden;
    /* display: flex;
    flex-direction: column; */
    position: relative;
    z-index: 1;
    padding-top: @topH;
  }
  header {
    position: absolute;
    z-index: 2;;
    top: 0;
    left: 0;
    right:0;
    height: @topH;
    /* background-color: #3298dc; */
    padding-left: @sizePadding;
    padding-right: @sizePadding;
    display: flex;
    flex-direction: row;
    align-items: center;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); */
    h1 {
      flex: 1;
      /* color: #fff; */
      /* font-size: 18px; */
      margin-bottom: 0;
    }
    .gm-title-input {
      /* color: #fafafa; */
      font-size: 18px;
      border: none;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      padding: 2px 0;
      display: inline-block;
      width: 100%;
      background: transparent;
      outline: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);

      &:focus {
        border-bottom: 1px solid rgba(0, 0, 0, 0.8);
      }
    }
  }
  .gm-post-detail-tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: @sizePadding;


    .gm-icon {
      cursor: pointer;
      margin-left: 15px;
      /* color: darken(#fff, 5%); */
      user-select: none;
      color: rgba(0, 0, 0, 0.6);
      font-size: 18px;
      &:hover {
        /* color: #fff; */
        color: rgba(0, 0, 0, 0.9)
      }
    }
  }
  .gm-post-detail {
    height: 100%;
    overflow: hidden;
    padding: @sizePadding 0 @sizePadding + 10 @sizePadding;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
  }
  .gm-editor-config {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 2;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: -1px 3px 3px rgba(0, 0, 0, 0.2);
  }
  .gm-editor-status {
    position: absolute;
    bottom: 0;
    left: @sizePadding;
    padding: 8px 10px 8px 0;
    font-size: 12px;
    width: 40%;
    display: flex;
    justify-content: space-between;
  }
  .gm-post-box {
    max-width: 800px;
    height: 100%;

    @hs: 0,1,2,3,4;
  
    each(@hs, {

      @media (min-width :  1400px + (@value * 200 ) ) {
        & {
          max-width: 1000px + (@value * 200)
        }
      }
    });
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

  .gm-tag-status {
    text-transform: capitalize;
  }


</style>
<main>
  <header >
    <h1 class="title is-4">
      {#if isEditing } 
        <input type="text" value={postTitle} on:change={onTitleChange} class="gm-title-input" />
      {:else}
        {postTitle}
      {/if}
    </h1>
    <div class="gm-post-detail-tools">
      {#if isEditing } 
        <!-- <button class="button is-black is-small">publish</button>     -->
        <PublishBtn value={postStatus} {isSending} {isPublishing} {publishedTime} on:openToggle={publishPanelToggle} on:doPublish={doPublish}/>
        <span class="icon gm-icon" on:click={configToggle}>
          <i class="fas fa-cog"></i>
        </span>
      {:else if canEdit}
        <!-- <button class="button is-small" on:click={doEdit}>Edit</button> -->
        <span class="icon gm-icon" on:click={doEdit}>
          <i class="fas fa-pen-nib"></i>
        </span>
      {/if}
    </div>
  </header>
  <div class="gm-post-detail" >
    <div class="gm-post-box" >
      {#if isEditing } 
        <div class="gm-editor-box">
          <Editor {topHeight} {bottomHeight} {fileUploadFun} on:open="{onHasEditor}" on:close="{onEditorClose}"/>
        </div>
        
      {:else}
        <div class="gm-post-html">
          <PostPreview {postHTML} />
        </div>
      {/if}
    </div>


    <div class="gm-editor-status">
      <div class="gm-editor-status-left">
        {#if isEditing } 
          <span class="gm-tag-status" style="margin-right: 20px;">
            {postStatus}
            {#if isDraft}
              (auto save)
            {/if}
          </span>
          {#if isSending} 
            <span style="color: hsl(171, 100%, 41%);">Saving……</span>
          {/if}
        {/if}
      </div>
      <div class="gm-editor-status-right">
        {#if postUrl}
          <a href="{postUrl}" target="_blank">Preview <i class="fas fa-external-link-alt"></i></a>
        {/if}
      </div>
    </div>
    
     
    <div class="gm-editor-config" style="{configPageStyle}">
      <PostConfig on:change={onPostConfigChange} />
    </div>
    <!-- <div class="gm-detail-footer">
    </div> -->
  </div>
</main>

<script>
  import { onMount, afterUpdate, tick } from 'svelte';
  import Editor from './Editor.svelte'
  import PostPreview from './PostPreview.svelte'
  import PostConfig from './PostConfig.svelte'
  import PublishBtn from './PublishBtn.svelte'
  import { writable, derived } from 'svelte/store';
  import { ghostApiService, postDetail, postList, editorInitValue, message, blogConfig, saveOrPublish, editor } from '@store'
  import { EditorSaveInterval, handlePost } from '@config';
  import debounce from 'lodash/debounce';
 

  // const postType = "scheduled" | "published" | "draft"
  // 编辑与否
  let publihClicked = false;
  let title = '';
  const topHeight = 50 + 20;
  const configWidth = 320;
  const maxEditorWidth = 800;
  const bottomHeight = 0;
  
  let haschanged = false;
  

  // $: selectedPost = $postDetail ? $postDetail.post ? $postDetail.post: {} : {};
  $: selectedPost = $postDetail ? $postDetail.post : null;
  $: canEdit = $postDetail && $postDetail.post;
  $: postHTML = selectedPost && typeof selectedPost === 'object' ? selectedPost.html : '';
  $: postTitle = selectedPost && typeof selectedPost === 'object' ? selectedPost.title : '';
  $: publishedTime = selectedPost && typeof selectedPost === 'object' ? selectedPost.published_at : '';
  $: _markdown = selectedPost && typeof selectedPost === 'object' ? selectedPost.markdown : '';
  $: supportMd = selectedPost && typeof selectedPost === 'object' ? !!selectedPost.supportMd : false; 
  $: isEditing = $postDetail  && $postDetail.isEditing;
  $: isSending = $postDetail  && $postDetail.isSending;
  $: isConfiging = $postDetail  && $postDetail.isConfiging;
  $: isPublishing = $postDetail  && $postDetail.isPublishing;
  $: configPageStyle = `width:${configWidth}px;right: ${isConfiging ? 0:-configWidth - 10}px`
  $: postStatus = selectedPost ? selectedPost.status : 'draft';
  $: isDraft = !selectedPost || $ghostApiService && selectedPost.status === $ghostApiService.postStatus.draft;
  $: blogUrl = $blogConfig ? $blogConfig.url : '';
  // $: isScheduled = selectedPost && $ghostApiService && selectedPost.status === $ghostApiService.postStatus.scheduled ;
  $: isPublished = selectedPost && $ghostApiService && selectedPost.status === $ghostApiService.postStatus.published ;
  $: postUrl = selectedPost ? isPublished ? `${blogUrl}/${selectedPost.slug}`:`${blogUrl}/p/${selectedPost.uuid}`:'';


  const saveOrPublishWithDebounce = debounce(saveOrPublish, 1000 * 10);
  const trySaveOrPublishWithDebounce = async () => {
    console.log('--trySaveOrPublishWithDebounce--')
    haschanged = true;
    try {
      await saveOrPublishWithDebounce()
    } catch (error) {      
    } finally {
      haschanged = false
    }
  }

  const editorValue = derived(editor, ($editor, set) => {
    console.log('--editor--', $editor)
    if (!$editor){ return }
    let isFirst = true;
    const interval = setInterval(() => {
      // console.log('--interval ing--', !!$editor, $editor.value().length)
      if ($editor && (!selectedPost || selectedPost && !isFirst) && !isSending) {
        if (isDraft) {
          const value  = $editor.value();
          console.log('--- auto saving ---')
          set(value)
        } else {
          console.log('--- not draft --- no auto saving')
        }
      }
      isFirst = false;
    }, EditorSaveInterval);
    return () => {
      console.log('--clearInterval--')
      interval && clearInterval(interval)
    }
  }, '');

  const editorValueUnSub =  editorValue.subscribe(async value=> {
    console.log('--editorValue--', value)
    await trySaveOrPublishWithDebounce();
  });

  function publishPanelToggle(e = {}) {
    const isPublishing = e.detail ? !e.detail : true
    postDetail.update(data => {
      return {
        ...data,
        isPublishing
      }
    })
  }
  async function onTitleChange(e) {
    const title = e.target.value;
    postDetail.update(data => {
      return {
        ...data,
        post: {
          ...data.post,
          title
        }
      }
    });
    await tick();
    onPostConfigChange()
  }
  function onPostConfigChange() {
    console.log('--onPostConfigChange--')
    trySaveOrPublishWithDebounce()
  }
  async function doPublish(e) {
    console.log('---doPublish--- 0',e.detail)
    if (!$ghostApiService.hasApi) {return}
    try {
      const {status, time, changed} = e.detail;
      console.log('---doPublish---', status, time, changed)
      if (changed || (status !== $ghostApiService.postStatus.draft ) && time) {
        console.log('--- do publish---')
        await saveOrPublish(status, time)
      }
    } catch (error) {
      console.log('--- do publish error---', error)
    } finally {
      publishPanelToggle({detail: true})
    }
  }
  
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
    // console.warn('--onHasEditor--',_markdown)
    // !_markdown && console.warn('---onHasEditor- empty md---')
    editor.set(e.detail);
    editorInitValue.set({markdown:_markdown}) 
  }
  function onEditorClose() {
    console.log('--onEditorClose--',editor)
    editor.set(null);
  }

  function doEdit() {
    console.log('---doEdit---')
    if (!supportMd) {
      message.set({
        body: 'No Support Yet. not single markdown card',
        type: 'warning'
      });
      return;
    }
    
    // title = selectedPost ? selectedPost.title : '';
    console.log('---doEdit---')
    postDetail.update(data => {
      return {
        ...data,
        isEditing:true
      }
    })
  }
  


  async function fileUploadFun(file) {
    console.log('---fileUploadFun---', file)
    let url = '';
    if ($ghostApiService.hasApi) {
      url = await $ghostApiService.uploadImg(file);
      console.log('---fileUploadFun upload ---', url)
    }
    if (!url) {
      message.set({
        body: 'upload image fail',
        type: 'danger'
      });
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