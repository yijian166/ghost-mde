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
    padding: @sizePadding 0 @sizePadding @sizePadding;
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

  .gm-tag-status {
    text-transform: capitalize;
  }


</style>
<main>
  <header >
    <h1 class="title is-4">
      {#if isEditing } 
        <input type="text" bind:value={title} class="gm-title-input" />
      {:else}
        {postTitle}
      {/if}
    </h1>
    <div class="gm-post-detail-tools">
      {#if isEditing } 
        <!-- <button class="button is-black is-small">publish</button>     -->
        <PublishBtn value={postStatus} {isSending} {isPublishing} {publishedTime} on:openToggle={publishPanelToggle} on:doPublish={doPublish}/>
        <span class="icon gm-icon" on:click={configToggle}>
          <i class="far fa-compass"></i>
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


    {#if isEditing } 
    <div class="gm-editor-status">
      <span class="gm-tag-status" style="margin-right: 20px;">
        {postStatus}
        {#if isDraft}
          (auto save)
        {/if}
      </span>
      {#if isSending} 
        <span style="color: hsl(171, 100%, 41%);">Saving……</span>
      {/if}
    </div>
    {/if}
    
     
    <div class="gm-editor-config" style="{configPageStyle}">
      <PostConfig on:change={onPostConfigChange} />
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
  import PublishBtn from './PublishBtn.svelte'
  import { writable, derived } from 'svelte/store';
  import { ghostApiService, postDetail, postList, editorInitValue, message } from '@store'
  import { EditorSaveInterval, handlePost } from '@config';
  import debounce from 'lodash/debounce';
  import pick from 'lodash/pick';

  // const postType = "scheduled" | "published" | "draft"
  // 编辑与否
  let publihClicked = false;
  let title = '';
  const topHeight = 50 + 20;
  const configWidth = 320;
  const maxEditorWidth = 800;
  const bottomHeight = 0;
  let editor = writable();
  const supportEditKeys = ['id', 'feature_image', 'slug', 'updated_at', 'status','visibility']

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
  $: isDraft = !selectedPost || $ghostApiService && selectedPost.status === $ghostApiService.postStatus.draft ;
  // $: isScheduled = selectedPost && $ghostApiService && selectedPost.status === $ghostApiService.postStatus.scheduled ;
  // $: isPublished = selectedPost && $ghostApiService && selectedPost.status === $ghostApiService.postStatus.published ;


  const saveOrPublishWithDebounce = debounce(saveOrPublish, 1000 * 10);

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
    console.log('--editorValue--', value.length)
    await saveOrPublishWithDebounce();
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
  function onPostConfigChange() {
    saveOrPublishWithDebounce()
  }
  async function doPublish(e) {
    if (!$ghostApiService.hasApi) {return}
    try {
      const {status, time, changed} = e.detail;
      console.log('---doPublish---', status, time, changed)
      if (changed || status === $ghostApiService.postStatus.scheduled && time) {
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
    
    title = selectedPost ? selectedPost.title : '';
    console.log('---doEdit---')
    postDetail.update(data => {
      return {
        ...data,
        isEditing:true
      }
    })
  }
  
  async function saveOrPublish(toStatus, published_at) {
    let newPost
    try {
      if (!$editor || !isEditing) {
        return;
      }
      postDetail.update(data => {
        return {
          ...data,
          isSending:true,
        }
      })
      const md = $editor.value();
      const status = toStatus ? toStatus : (selectedPost || {}).status || $ghostApiService.postStatus.draft;
      const post = {
        title,
        ...pick(selectedPost || {}, supportEditKeys),
        status,
        ...(status === $ghostApiService.postStatus.scheduled ? {published_at: new Date(published_at)}:{}) // scheduled 情况下， published_at 应该需要存在
      }
      console.log('---saveOrPublish start api call----')
      const data = await $ghostApiService.savePost(post, md);
      newPost = handlePost(data);
      
      postList.update(postListData => {
        const list = selectedPost ? postListData.list.map(item => {
          if (item.id === newPost.id) {
            return newPost
          }
          return {...item}
        }):  [newPost,...postListData.list]
        console.log('---postList.update---', list)
        
        return {
          ...postListData,
          list
        }
      })
      console.log('---saveOrPublish---', newPost, newPost.updated_at);
      return newPost;
    } catch (error) {
      // TODO: 处理接口失败的情况
      let code = ''
      let msg = 'post save failed'
      if (Array.isArray(error) && error.length > 0) {
        code = error[0].code;
        msg = error[0].message;
      }
      message.set({
        body: msg,
        type: 'danger'
      })

      // 409 Conflict code === "UPDATE_COLLISION"
      // 1. 每次更新的时候，传的是上次拿到的updated_at time
      // 2. 如果接口冲突说明，说明别人比你拿到了更新的server端 updated_at time 这样也就是冲突了
      // 3. 提示用户推出编辑，拉取一封最新的post信息
      // 4. 因此这里是实际上是一种抢占式的，防冲突策略
    } finally {
      postDetail.update(value => {
        const ob = {}
        if (newPost) {
          if(selectedPost) {
            ob.post = newPost
          } else {
            ob.post = {
              ...value.post,
              ...pick(newPost, supportEditKeys.concat(['html']))
            }
          }
        }
        return {
          ...value,
          isSending:false,
          ...ob
        }
      });
    }
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