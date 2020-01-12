<style type="text/less">
  aside {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    border-right: 1px solid #ddd;
  }
  .gm-haeder {
    margin-bottom: 0;
    height: 50px;
    line-height: 50px;
    /* background-color: #3298dc; */
    padding-left: 10px;
    /* font-size: 16px; */
    /* color: white; */
    /* border-right: 1px solid #bbb; */
    position: relative;
    padding-right: 50px;
    /* box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) */

    &:hover {
      .gm-config-btn {
        display: block;
      }
    }
  }
  .gm-config-btn {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: transparent;
    border: none;
    /* color: #fff; */
    cursor: pointer;
    font-size: 18px;
    color: hsl(348, 100%, 61%);
    opacity: 0.4;
    &:hover {
      /* color: #fff; */
      opacity: 0.6;
      color: darken(hsl(348, 100%, 61%), 5%);
    }
  }
  .gm-post-list {
    flex: 1;
    overflow: auto;
    position: relative;
    z-index: 1;
    /* border-right: 1px solid #bbb; */
  }
  .gm-post-p {
    min-height: 24px;
  }
  .gm-post-isloading {
    position: absolute;
    top: 50px;
    /* left: 0; */
    right: 0;
    /* height: 30px;
    line-height: 30px; */
    text-align: center;
    /* background-color: hsl(217, 71%, 53%); */
    /* opacity: 0.5; */
    /* color: #fff; */
    border: none;
    z-index: 2;
  }
  ul {
    padding-right: 10px;
  }
  li {
    padding: 10px;
    cursor: pointer;
    border-right: 4px solid transparent;
    position: relative;
    z-index: 1;
    margin-bottom: 10px;

    padding-right: 25px;

    &:hover {
      .post-tool {
        display: block;
      }
    }

    
    &.active {
      border-right-color: hsl(217, 71%, 53%);
      /* color: #fff; */
    }
    .title {
      margin-bottom: 5px;
    }

    p {
      /* overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; */
      overflow: hidden; 
      text-overflow:ellipsis; 
      display: -webkit-box; 
      -webkit-line-clamp:2; 
      -webkit-box-orient:vertical; 
    }
  }
  .post-tool {
    position: absolute;
    z-index: 10;
    top: 50%;
    right: 10px;
    display: none;
    margin-top: -12px;;

    .icon {
      color: hsl(348, 100%, 61%);
      opacity: 0.7;
    }
  }
  .gm-footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding-bottom: 30px;
  }
  .gm-post-others {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .gm-post-ptime {
    font-size: 12px;
  }
  .gm-tag-status {
    text-transform: capitalize;
  }
  .gm-add-btn {
    position: absolute;
    right: 8px;
    bottom: 20px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: none;
    background-color: #3298dc;
    z-index: 10;
    color: #fff;
    box-shadow: 1px 3px 8px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    &:hover {
      background-color: darken(#3298dc, 5%);
    }
  }
</style>
<aside>
  <h1 class="gm-haeder title is-5">
    {blogUrl}
    {#if hasBlog} 
    <button class="gm-config-btn" on:click={rmBlog}>
      <!-- <i class="fas fa-cog"></i> -->
      <i class="fas fa-trash-restore-alt" alt="remove blog"></i>
    </button>
    {/if}
  </h1>
  {#if hasBlog} 
    <button class="gm-add-btn" on:click={newPost}>
      <i class="fas fa-plus"></i>
    </button>
  {/if}
  {#if isLoading}
    <button class="gm-post-isloading button is-loading">Loading</button>
  {/if}
  <div class="gm-post-list">

    <ul>
      {#each list as post}
        <li on:click="{() => selectPost(post)}" class:active={selectedPostId === post.id}>
          <h5 class="title is-6">{post.title}</h5>
          <p class="gm-post-p">{post.excerpt || ''}</p>
          <!-- ellipsis-v -->
          <div class="gm-post-others">
            <span 
              class="tag  is-light gm-tag-status " 
              class:is-danger={post.status === postStatus.draft} 
              class:is-success={post.status === postStatus.published}
              class:is-info={post.status === postStatus.scheduled}
            >
              {post.status}
            </span>
            {#if post.status === postStatus.scheduled} 
            <span class="gm-post-ptime">
              {post.publishedTime}
            </span>
            {/if}
          </div>
          
          <div class="post-tool">
            <span class="icon is-small" on:click|stopPropagation={() => del(post)}>
              <i class="fas fa-trash-alt" aria-hidden="true"></i>
            </span>
          </div>
        </li>
      {/each}
    </ul>
    <div class="gm-footer">
      {#if hasMore}
        <button class="button is-white" class:is-loading={isLoading} on:click={doLoadMore}>load more</button>
      {:else if list.length > 0}
        <button class="button is-white" disabled>no more</button>
      {/if}
    </div>
  </div>
</aside>

<script>
  import Box from './Box.svelte'
  import { initPostDetail, postDetail, postList, ghostApiService, confirmModal, message,  quitEdit, blogConfig} from '@store';
  import { BlogConfigInfo } from '@api';
  import { writable, get } from 'svelte/store';
  import { saveData, getData } from '@db'
  $: list = Array.isArray($postList.list) ? $postList.list : [];
  $: isLoading = !!$postList.isLoading;
  $: totalCount = $postList ? $postList.total : 0;
  $: hasMore = totalCount > list.length;
  $: isEditing = $postDetail && $postDetail.isEditing;
  $: selectedPostId = $postDetail ? $postDetail.post ? $postDetail.post.id:'':'';
  $: postStatus = $ghostApiService ? $ghostApiService.postStatus : {};
  $: hasBlog = $ghostApiService && $ghostApiService.hasApi;
  $: blogUrl = hasBlog ? $ghostApiService.blogConfig.showUrl: ''

  function showIsEditor() {
    quitEdit(false)

  }
  function rmBlog() {
    confirmModal.set({
      title: 'Are you sure you want to remove this Blog?',
      body: `You're about to remove "${blogUrl}". `,
      confirmText: 'Remove',
      asyncFun: async () => {
        try {
          const emptyConfig = new BlogConfigInfo('', '')
          await saveData('blogInfo', emptyConfig);
          await saveData('blogInfo', emptyConfig, true);
          await saveData('postList', {posts:[], total:0})
          blogConfig.set(emptyConfig)
          return true
        } catch (error) {
          return false
        }
        
      }
    })
  }
  async function newPost() {
    if (await quitEdit(false)) {
      postDetail.set({
        ...initPostDetail,
        isEditing: true,
      })
    }
  }
  async function selectPost(post) {
    if (selectedPostId === post.id) {
      return;
    }
    if (await quitEdit(false)) {
      postDetail.set({
        ...initPostDetail,
        post: post
      })
    }
  }

  async function doLoadMore() {
    const {page, limit} = get(postList);
    getList($ghostApiService, page+1, limit, true)
  }

  async function getList(api, page, limit, loadMore = false) {
    console.log('---ghostApiService has value--', api.hasApi)
    if (!api.hasApi) {
      // no api get list form chrome storage
      const cacheData = await getData('postList')
      console.log('---ghostApiService get cacheData--', cacheData)
      const _posts = cacheData.isOk ? cacheData.data.posts: [];
      const _total = cacheData.isOk ? cacheData.data.total: 0;
      postList.update(data => {
        return {
          ...data,
          list: _posts,
          total: _total
        }
      })
    } else {
      postList.update(data => {
        return {
          ...data,
          isLoading: true,
        }
      });
      const { posts, total } = await api.getPosts(page, limit);
      if (page === 1) {
        // cache first page
        await saveData('postList', {posts, total})
      }
      const sitConfig = await api.getSiteConfig();
      console.log('---GhostAdminApi--', posts, total, sitConfig)
      postList.update(data => {
        return {
          ...data,
          total,
          page,
          list: (page === 1 ? []:data.list).concat(posts) ,
          isLoading: false
        }
      })
    }
  }

  ghostApiService.subscribe(async api => {
    console.warn('---ghostApiService has changed---', api.hasApi)
    const {page, limit} = get(postList);
    getList(api, page, limit)
  });

  function del(post) {
    confirmModal.set({
      title: 'Are you sure you want to delete this post?',
      body: `You're about to delete "${post.title}". This is permanent!`,
      confirmText: 'Delete',
      asyncFun: async () => doDel(post.id)
    })
  }

  async function doDel(id) {
    const isOk = await $ghostApiService.delPost(id);
    console.log('---del isOk---', isOk);
    if (isOk) {
      postList.update(data => {
        return {
          ...data,
          list: data.list.filter(item => item.id !== id)
        }
      });
      if ($postDetail && $postDetail.post && $postDetail.post.id === id) {
        postDetail.update(data => {
          return {
            isSending: false,
            isEditing:false,
            post: null
          }
        })
      }
    }

    return isOk;
  }


  
</script>