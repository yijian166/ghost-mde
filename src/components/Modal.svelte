<div class="modal" class:is-active={showShow}>
  <div class="modal-background" ></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{title}</p>
      <button class="delete" aria-label="close" on:click={cancel}></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
      <p>{body}</p>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-danger" on:click={save} class:is-loading={isSending} disabled={isSending}>{confirmText}</button>
      <button class="button" on:click={cancel} disabled={isSending}>Cancel</button>
    </footer>
  </div>
</div>
<script>
  import { confirmModal, message } from '@store'

  $: title = typeof $confirmModal === 'object' ? $confirmModal.title : '';
  $: body = typeof $confirmModal === 'object' ? $confirmModal.body : '';
  $: confirmText = typeof $confirmModal === 'object' ? $confirmModal.confirmText : '';
  $: showShow = !!title;

  let isSending = false;
  

  async function save() {
    const notQuit = typeof $confirmModal !== 'object' || !$confirmModal.isQuit; 
    if (typeof $confirmModal === 'object' &&  typeof $confirmModal.asyncFun === 'function') {
      
      try {
        isSending = true
        const isok = await $confirmModal.asyncFun()
        if (isok) {
          cancel();
          notQuit && message.set({
            body:`${confirmText} success`,
            type: 'success'
          })
        }else {
          notQuit && message.set({
            body:`${confirmText} fail`,
            type: 'danger'
          })
        }
      } catch (error) {
        console.log('---error', error)
        notQuit && message.set({
          body:`${confirmText} fail`,
          type: 'danger'
        })
      } finally {
        isSending = false
      }
    } 
  }

  async function cancel() {
    if (typeof $confirmModal === 'object' &&  typeof $confirmModal.cancelFun === 'function') {
      await $confirmModal.cancelFun()
    }
    confirmModal.set({})
  }
</script>