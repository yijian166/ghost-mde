<InputBox label={'Post URL'}>
  <input class="input" {value} on:change={onValueChange} type="text" placeholder="Text input">
</InputBox>
<script>
  import InputBox from './InputBox.svelte'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  // import debounce from 'lodash/debounce';
  $:value = $$props.slug || ''


  const onValueChange = async e => {
    console.log('---', e.target.value)
    const _v = e.target.value;
    dispatch('change', _v)
  }
</script>