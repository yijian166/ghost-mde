<div class="modal" class:is-active={show}>
  <div class="modal-background" ></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{title}</p>
      {#if !noCancel}
        <button class="delete" aria-label="close" on:click={cancel}></button>
      {/if}
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
      <slot></slot>
    </section>
    <footer class="modal-card-foot">
      <button 
        class="button"
        on:click={save}
        class:is-loading={isSending}
        class:is-danger={isDanger}
        class:is-success={isSuccess}
        disabled={isSending}>
        {confirmText}
      </button>
      {#if !noCancel}
        <button class="button" on:click={cancel} disabled={isSending}>Cancel</button>
      {/if}
    </footer>
  </div>
</div>

<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  $: title = $$props.title;
  $: isSending = $$props.isSending;
  $: show = !!$$props.show;
  $: confirmText = $$props.confirmText || 'Ok'
  $: btnType = $$props.btnType || 'success'
  $: isDanger = $$props.btnType === 'danger';
  $: isSuccess = btnType === 'success'
  $: canEsc = !$$props.noEsc
  $: noCancel = !!$$props.noCancel

  $: {
    if(show && canEsc && !noCancel) {
      // console.warn('---doesc---')
      document.addEventListener('keyup', doEsc) 
    }
  }

  function doEsc(e) {
    // console.log('---doesc---',e)
    if (e.keyCode === 27) {
      //esc
      document.removeEventListener('keyup', doEsc)
      cancel()
    }
  }

  function cancel() {
    console.log('---cancel')
    dispatch('cancel')
  }

  function save() {
    console.log('---save')
    dispatch('save')
  }
</script>