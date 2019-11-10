<style type="text/less">
  div {
    height: 100%;
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
<div>
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

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
</script>