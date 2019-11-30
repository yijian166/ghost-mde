<style type="text/less">
  aside {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  h1 {
    height: 50px;
    line-height: 50px;
    background-color: #3298dc;
    padding-left: 10px;
    font-size: 16px;
    color: white;
    border-right: 1px solid #bbb;
    position: relative;
    padding-right: 50px;;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2)
  }
  .add-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 40px;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
  }
  .gm-post-list {
    flex: 1;
    overflow: auto;
    position: relative;
    z-index: 1;
    /* border-right: 1px solid #bbb; */
  }
  .gm-post-isloading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: hsl(217, 71%, 53%);
    opacity: 0.5;
    color: #fff;
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

    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
</style>
<aside>
  <h1 class="haeder">
    Blog List 
    <button class="add-btn" on:click={newPost}>
      <i class="fas fa-plus"></i>
    </button>
  </h1>
  <div class="gm-post-list">
    {#if isLoading}
      <span class="gm-post-isloading">Loading</span>
    {/if}
    <ul>
      {#each list as post}
        <li on:click="{() => selectPost(post)}" class:active={selectedPostId === post.id}>
          <h4>{post.title}</h4>
          <p>{post.excerpt}</p>
          
          {#if post.status === 'draft'}
          <!-- ellipsis-v -->
            <span class="tag is-danger is-light">{post.status}</span>
          {/if}
          <div class="post-tool">
            <span class="icon is-small" on:click|preventDefault={() => del(post.id)}>
              <i class="fas fa-trash-alt" aria-hidden="true"></i>
            </span>
          </div>
        </li>
      {/each}
    </ul>
    <div class="gm-footer">
      {#if hasMore}
        <button class="button is-white" class:is-loading={isLoading} on:click={doLoadMore}>Load More</button>
      {:else if list.length > 0}
        <button class="button is-white" disabled>No More</button>
      {/if}
    </div>
  </div>
</aside>

<script>
  import Box from './Box.svelte'
  import { initPostDetail, postDetail, postList, ghostApiService } from '@store';
  import { writable, get } from 'svelte/store';

  $: list = Array.isArray($postList.list) ? $postList.list : [];
  $: isLoading = !!$postList.isLoading;
  $: totalCount = $postList ? $postList.total : 0;
  $: hasMore = totalCount > list.length;
  $: isEditing = postDetail && postDetail.isEditing;
  $:selectedPostId = $postDetail ? $postDetail.post ? $postDetail.post.id:'':'';

  function newPost() {
    if (isEditing) {return}
    postDetail.set({
      ...initPostDetail,
      isEditing: true,
    })
  }
  function selectPost(post) {
    if (isEditing) {return}
    postDetail.set({
      ...initPostDetail,
      post: post
    })
  }

  async function doLoadMore() {
    const {page, limit} = get(postList);
    getList($ghostApiService, page+1, limit, true)
  }

  async function getList(api, page, limit, loadMore = false) {
    console.log('---ghostApiService has value--', api)
    if (!api) {
      postList.update(data => {
        return {
          ...data,
          list: [],
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
      const sitConfig = await api.getSiteConfig();
      console.log('---GhostAdminApi--', posts, total, sitConfig)
      postList.update(data => {
        return {
          ...data,
          total,
          page,
          list: data.list.concat(posts) ,
          isLoading: false
        }
      })
    }
  }

  ghostApiService.subscribe(async api => {
    const {page, limit} = get(postList);
    getList(api, page, limit)
  });

  async function del(id) {
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
  }


  
</script>