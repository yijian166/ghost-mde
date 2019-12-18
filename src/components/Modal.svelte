<ModalBox
 {show} 
 {title}
 {isSending}
 {confirmText}
 btnType="danger"
 on:cancel={cancel}
 on:save={save}
>
  <p>{body}</p>
</ModalBox>
<script>
  import { confirmModal, message } from '@store'
  import ModalBox from './ModalBox.svelte'

  $: title = typeof $confirmModal === 'object' ? $confirmModal.title : '';
  $: body = typeof $confirmModal === 'object' ? $confirmModal.body : '';
  $: confirmText = typeof $confirmModal === 'object' ? $confirmModal.confirmText : '';
  $: show = !!title;

  let isSending = false;
  

  async function save() {
    console.log('---cancel---')
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
    console.log('---cancel---')
    if (typeof $confirmModal === 'object' &&  typeof $confirmModal.cancelFun === 'function') {
      await $confirmModal.cancelFun()
    }
    confirmModal.set({})
  }
</script>