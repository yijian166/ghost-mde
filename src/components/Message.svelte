<style type="text/less">
  @sizeW: 400px;
  .gm-message {
    position: fixed;
    top: 60px;
    right: -@sizeW - 16px;
    width: @sizeW;
    /* left: 50%;
    margin-left: -250px; */
    z-index: 100;
    transition-duration: 0.1s;
    transition-property: right;
    transition-timing-function: ease-in;

    &.show {
      right: 16px;
    }
  }
</style>
<div class="gm-message" class:show={showMsg}>
  <article 
    class="message"
    class:is-info={isInfo}
    class:is-success={isSuccess}
    class:is-warning={isWarning}
    class:is-danger={isDanger}
  >
    <!-- <div class="message-header">
      <p>Hello World</p>
      <button class="delete" aria-label="delete"></button>
    </div> -->
    <div class="message-body">
      {body}
    </div>
  </article>
</div>
<script>
  import { message } from '@store'
  import { derived } from 'svelte/store';

  const newMsg = derived(message, ($message, set) => {
    set($message)
    if ($message) {
      setTimeout(() => {
        set(null)
      }, 3 * 1000)
    }
  })

  $: body = $newMsg && typeof $newMsg === 'object' ? $newMsg.body || '' : '';
  $: isInfo = !$newMsg || typeof $newMsg !== 'object' || !$newMsg.type || $newMsg.type === 'info';
  $: isSuccess = $newMsg && typeof $newMsg === 'object' && $newMsg.type === 'success';
  $: isWarning = $newMsg && typeof $newMsg === 'object' && $newMsg.type === 'warning';
  $: isDanger = $newMsg && typeof $newMsg === 'object' && $newMsg.type === 'danger';
  $: showMsg = !!body
</script>