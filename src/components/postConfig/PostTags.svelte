<style type="text/less">
  .gme-box {
    display: inline-block;
    background-color: white;
    border-color: #dbdbdb;
    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    color: #363636;
    padding: 0 4px;
    min-height: 2.5em;
  }

  .tag {
    margin-right: 5px;
  }
</style>
<InputBox label={'Tags'}>
  <div class="gme-box" on:click|stopPropagation={focusInput}>
    {#each tags as tag}
      <span class="tag is-primary">
        {tag.name}
        <button class="delete is-small" on:click|stopPropagation={() => rmTag(tag.id)}></button>
      </span>
    {/each}
    <SearchSelect bind:this={searchSelectCmp} {list} on:select={addTag} />
  </div>
</InputBox>
<script>
  import InputBox from './InputBox.svelte'
  import SearchSelect from './SearchSelect.svelte'
  import { tagList } from '@store'
  import { createEventDispatcher } from 'svelte';
  let searchSelectCmp;
  const dispatch = createEventDispatcher();

  $: tagListFromStore = $tagList ? $tagList.list : [];
  $: tags = Array.isArray($$props.tags) ? $$props.tags : [];
  console.log('---tags tags--', $$props.tags)
  $: tagIds = tags.map(item => item.id);
  $: list = tagListFromStore.filter(item => !tagIds.includes(item.id));

  function focusInput() {
    // console.log('---searchSelectCmp---', searchSelectCmp,searchSelectCmp.focusInput)
    if (searchSelectCmp && typeof searchSelectCmp.focusInput === 'function') {
      searchSelectCmp.focusInput()
    }
  }

  function rmTag(tagId){
    const _list = tags.filter(item => item.id !== tagId)
    dispatch('change', _list)
  }

  function addTag(e) {
    const {tag, isNew} = e.detail;
    console.log('---addTag 000--', tag, isNew, tags)
    const item = isNew ? {
      id: Symbol(tag),
      name: tag,
      slug: null,
      description: null,
      parent: null,
      meta_title: null,
      meta_description: null,
      feature_image: null,
      visibility: "public"
    }: tagListFromStore.find(item => item.id === tag);
    if (!item) {
      return 
    }
    const _list = [...tags]
    _list.push(item);
    console.log('---addTag--', _list)
    dispatch('change', _list)
  }

</script>