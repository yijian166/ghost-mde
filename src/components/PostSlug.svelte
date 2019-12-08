<InputBox label={'Post URL'}>
  <input class="input" {value} on:change={onValueChange} type="text" placeholder="Text input">
</InputBox>
<script>
  import InputBox from './InputBox.svelte'
  import { ghostApiService } from '@store'
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  // import debounce from 'lodash/debounce';
  $:value = $$props.slug || ''


  const onValueChange = async e => {
    console.log('---', e.target.value)
    const _v = e.target.value;
    dispatch('change', _v)
    // try {
    //   const slug = await $ghostApiService.getSlug(_v);
    //   console.log('---slug', slug)
    // } catch (error) {
    //   // TODO: 提示
    //   console.log('---slug error', error)
    // }
  }
</script>