<InputBox label={'Post access'}>
  <div class="select">
    <select value={value} on:change={onValueChange}>
      {#each PostVisibilitys as item}
        <option value="{item.value}">{item.title}</option>
      {/each}
    </select>
  </div>
</InputBox>
<script>
  import InputBox from './InputBox.svelte'
  import { createEventDispatcher } from 'svelte';
  import { PostVisibilitys } from '@config'
  const dispatch = createEventDispatcher();
  // import debounce from 'lodash/debounce';
  $:value = $$props.visibility || ''


  const onValueChange = async e => {
    // console.log('---visibility onValueChange--',  e.target.options[ e.target.options.selectedIndex].value, e.target.value)
    const _v = e.target.value;
    dispatch('change', _v)
  }
</script>