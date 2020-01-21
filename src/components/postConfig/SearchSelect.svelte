<style type="text/less">
  .gme-select {
    display: inline-block;
    position: relative;
    z-index: 1;
  }
  input {
    min-width: 40px;
    width: 80px;
    /* width: auto;; */
    border: none;
    outline: none;
    height: 20px;
    box-sizing: content-box;
    &:focus {
      outline: none;
    }
  }
  .gme-select-list {
    position: absolute;
    z-index: 10;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: none;
    min-width: 160px;
    max-height: 400px;
    padding: 10px 0;

    &.show {
      display: block;
    }

    li {
      height: 42px;
      line-height: 42px;
      padding: 0 10px;
      cursor: pointer;

      &:hover,
      &.active {
        background-color: #eef6fc //rgba(0, 0, 255, 0.1)
      }
    }
  }
  
</style>
<div class="gme-select">
  <div class="gme-select-selected">
    <input type="text" bind:this={inputEl} bind:value={value} on:focus={onfocus} on:click|stopPropagation={() => {}} />
  </div>
  <div class="gme-select-list" class:show={isFocus}>
    <ul>
    {#if value}
      <li class:active={ -1 === selectIndex} on:click|stopPropagation={() => add(value, true)}>Add "{value}"</li>
    {/if}
    {#each list as item, index}
      <li class:active={index === selectIndex} on:click|stopPropagation={() => add(item.id)}>{item.name}</li>
    {/each}  
    </ul>
  </div>
</div>
<script>
  import { createEventDispatcher, tick } from 'svelte';
  const dispatch = createEventDispatcher();
  let inputEl;
  let value='';
  let isFocus = false;
  let selectIndex = 0;
  $:list = $$props.list.filter(item => !value || item.name.toLowerCase().includes(value.toLowerCase()));

  export function focusInput() {
    inputEl && inputEl.focus();
    // onfocus();
  }

  function onfocus() {
    console.log('---onfocus---')
    isFocus = true;
    document.addEventListener('keyup', handleKey)
    document.addEventListener('click', onBlur)
  }
  async function onBlur() {
    console.log('---onBlur---')
    isFocus = false;
    document.removeEventListener('click', onBlur)
    // await tick()
    document.removeEventListener('keyup', handleKey) 
  }

  function add(tag, isNew=false) {
    console.log('---select tag---', tag, isNew)
    dispatch('select',{tag, isNew})
    value='';
    onBlur();
  }
  function handleKey(e) {
    const keyCode = e.keyCode;
    const min = value ? -1 : 0;
    if (keyCode === 40) {
      // ArrowDown
      selectIndex += 1;
    } else if(keyCode === 38) {
      // ArrowUp
      selectIndex -= 1;
    } else if (keyCode === 13) {
      // Enter
      const isNew = selectIndex === -1 && !!value;
      add(isNew ? value : list[selectIndex].id, isNew)
    } else {
      selectIndex = min
    }
    if (selectIndex > list.length -1 ) {
      selectIndex = list.length -1
    }
    if (selectIndex < min) {
      selectIndex = min;
    }
    // console.log('---handleKey---', keyCode, selectIndex)
  }
</script>