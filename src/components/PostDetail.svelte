<style type="text/less">
  main {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  header {
    height: 50px;
    background-color: #3298dc;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    h1 {
      flex: 1;
      
    }
    input {
      color: #fafafa;
      font-size: 18px;
      border: none;
      height: 30px;
      line-height: 30px;
      box-sizing: border-box;
      padding: 2px 0;
      display: inline-block;
      width: 100%;
      background: transparent;
      outline: none;
      margin-top: 10px;
    }
  }
  .gm-post-detail-tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;


    .icon {
      cursor: pointer;
      margin-left: 15px;
      color: darken(#fff, 10%);

      &:hover {
        color: #fff;
      }
    }
  }
  .gm-post-detail {
    height: 100%;
    flex: 1;
    overflow: hidden;
    padding-right: 20px;
    padding-left: 20px;
    padding-top: 20px;
    display: flex;
    flex-direction: column;

  }
  .gm-detail-info {
    margin-bottom: 20px;
  }
  .gm-editor-box {
    flex: 1;
  }
  .gm-detail-footer {
    height: 100px;
  }
</style>
<main>
  <header >
    <h1>
      <input type="text" bind:value={title} />
    </h1>
    <div class="gm-post-detail-tools">
      <button class="button is-black is-small">publish</button>    
      <span class="icon">
        <i class="fas fa-cog"></i>
      </span>
    </div>
  </header>
  <div class="gm-post-detail">
    <div class="gm-editor-box">
      <Editor {markdown} {topHeight} {bottomHeight}/>
    </div>
    <div class="gm-detail-footer">
    </div>
  </div>
</main>

<script>
  import { onMount, afterUpdate } from 'svelte';
  import Editor from './Editor.svelte'
  let title = '';
  let markdown;
  const topHeight = 50 + 80;
  const bottomHeight = 100
  
  $: {
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