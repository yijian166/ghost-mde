<style type="text/less">
  div {
    height: 100%;
    overflow: hidden;
    padding-right: 20px;;
  }
  :global(.CodeMirror) {
    height: calc(100% - 200px)
  }
</style>
<div>
  {$$props.data ? $$props.data.id:'' }
  <textarea bind:this={textAreaElement} />
</div>
<script>
  import SimpleMDE from 'simplemde'
  import { onMount, afterUpdate } from 'svelte';
  import 'simplemde/dist/simplemde.min.css'
  import 'codemirror/lib/codemirror.css'
  let textAreaElement;
  let editor;
  onMount(() => {
    editor = new SimpleMDE({ element: textAreaElement, spellChecker: false });
  });

  afterUpdate(() => {
    try {
      console.log('--update-', $$props.data)
    if ($$props.data && typeof $$props.data === 'object' && $$props.data.mobiledoc) {
      const { cards } = JSON.parse($$props.data.mobiledoc);
      if (Array.isArray(cards) && cards.length) {
        const [ [type, { markdown }] ] = cards;
        console.log('--', type, markdown)
        if (type === 'markdown') {
          editor.value(markdown)
        }
      }
      console.log('--update-', mobiledoc)
    }
    } catch (error) {
      
    }
    
  })
</script>