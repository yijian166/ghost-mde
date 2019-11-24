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
  div {
    flex: 1;
    overflow: auto;
    /* border-right: 1px solid #bbb; */
  }
  ul {
    padding-right: 10px;
  }
  li {
    padding: 10px;
    cursor: pointer;
    border-right: 4px solid transparent;

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
</style>
<aside>
  <h1 class="haeder">
    Blog List 
    <button class="add-btn" on:click={newPost}>
      <i class="fas fa-plus"></i>
    </button>
  </h1>
  <div >
    <ul>
      {#each $$props.data as post}
        <li on:click="{() => selectPost(post)}" class:active={selectedPostId === post.id}>
          <h4>{post.title}</h4>
          <p>{post.excerpt}</p>
          
          {#if post.status === 'draft'}
            <span class="tag is-danger is-light">{post.status}</span>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</aside>

<script>
  import Box from './Box.svelte'
  import { isEditing, postDetail } from '@store';

  function newPost() {
    if ($isEditing) {return}
    postDetail.set({
      isNew: true,
      post: null
    })
  }
  function selectPost(post) {
    if ($isEditing) {return}
    postDetail.set({
      isNew: false,
      post: post
    })
  }

  $:selectedPostId = $postDetail ? $postDetail.post ? $postDetail.post.id:'':'';
  
</script>