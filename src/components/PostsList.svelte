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
  </div>
</aside>

<script>
  import Box from './Box.svelte'
  import { postDetail, postList, ghostApiService } from '@store';

  $: list = Array.isArray($postList.list) ? $postList.list : [];
  $: isLoading = !!$postList.isLoading;
  $: isEditing = postDetail && postDetail.isEditing;

  function newPost() {
    if (isEditing) {return}
    postDetail.set({
      isEditing: true,
      post: null
    })
  }
  function selectPost(post) {
    if (isEditing) {return}
    postDetail.set({
      post: post
    })
  }

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

  $:selectedPostId = $postDetail ? $postDetail.post ? $postDetail.post.id:'':'';
  
</script>