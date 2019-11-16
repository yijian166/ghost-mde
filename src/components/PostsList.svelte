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
  }
  div {
    flex: 1;
    overflow: auto;
  }
  ul {
    
  }
  li {
    padding: 10px;
    cursor: pointer;

    p {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
</style>
<aside>
  <h1 >Blog List </h1>
  <div >
    <ul>
      {#each $$props.data as post}
        <li on:click="{() => dispatch('select', post)}">
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
  import { createEventDispatcher } from 'svelte';
  import Box from './Box.svelte'
  const dispatch = createEventDispatcher();
  
</script>