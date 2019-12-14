<style type="text/less">
  .gm-radio-control {
    
    display: flex;
    flex-direction: column;

    .gm-radio {
      padding: 5px;
      /* display: flex;
      flex-direction: row;
      align-items: center; */
      /* line-height: 1.5; */
      input[type="radio"] {
        /* margin-top: -2px;; */
        /* line-height: 1.2; */
      }
    }
    .gm-input-time {
      margin-top: 8px;
      width: 100%;
    }
  }
  .gm-publish-action,
  .gm-radio-control {
    padding: 8px 16px;
  }
  .gm-publish-action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    .button {
      width: 82px;
      margin-left: 16px;
    }
  }
</style>
<div class="dropdown is-right" class:is-active={isPublishing} >
  <div class="dropdown-trigger">
    <button class="button is-black is-small" aria-haspopup="true" aria-controls="dropdown-menu" on:click|stopPropagation={publishPanelOpen}>
      <span class="icon is-small">
        <i class="fas fa-paper-plane"  aria-hidden="true"></i>
      </span>
      <span>Publish</span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu" role="menu" on:click|stopPropagation={() =>{}}>
    <div class="dropdown-content">
      <div class="gm-radio-control">
        {#if !isScheduled }
        <label class="gm-radio">
          <input type="radio" bind:group={value} value="published">
          Publish
        </label>
        {/if}
        {#if isPublished || isScheduled }
        <label class="gm-radio">
          <input type="radio" bind:group={value} value="draft">
          {#if isPublished }
          Unpublish
          {:else}
          Revert to draft
          {/if}
        </label>
        {/if}
        {#if isDraft || isScheduled }
        <label class="gm-radio">
          <input type="radio" bind:group={value} value="scheduled">
          Schedule for later
          <div class="gm-input-time">
            <input type='datetime-local' class="input" bind:value={time} on:focus={onTimeInputFocus}/>
          </div>
        </label>
        {/if}
      </div>
      <div class="gm-publish-action">
        <button class="button is-white" on:click={doQuitEdit}>Quit Editor</button>
        <button class="button" on:click={close} disabled={isSending}>Cancel</button>
        <button class="button is-info" on:click={doPublish} class:is-loading={isSending} disabled={isSending}>{okBtn}</button>
      </div>
    </div>
  </div>
</div>
<script>
  import { ghostApiService, postDetail, postList, quitEdit } from '@store'
  import { createEventDispatcher, afterUpdate, onDestroy, beforeUpdate } from 'svelte';
  import {PostStatus} from '@config'
  const dispatch = createEventDispatcher();
  let value = '';
  let time = '';
  $: isPublishing = !!$$props.isPublishing;
  $: oldStatus = $$props.value;
  $: selectedPost = $$props.post || null;
  $: isDraft = !$ghostApiService || oldStatus === PostStatus.draft ;
  $: isScheduled = $ghostApiService && oldStatus === PostStatus.scheduled ;
  $: isPublished = $ghostApiService && oldStatus === PostStatus.published ;
  $: isSending = !!$$props.isSending;
  $: okBtn = value === PostStatus.published ? 'Publish' : value === PostStatus.draft ? 'Unpublish':'Schedule';

  $: {
    // console.log('-=---', time, $$props.publishedTime)
    if (isPublishing) {
      document.addEventListener('click', close)
    }
  }

  Date.prototype.toDatetimeLocal = function toDatetimeLocal() {
    var
      date = this,
      ten = function (i) {
        return (i < 10 ? '0' : '') + i;
      },
      YYYY = date.getFullYear(),
      MM = ten(date.getMonth() + 1),
      DD = ten(date.getDate()),
      HH = ten(date.getHours()),
      II = ten(date.getMinutes()),
      SS = ten(date.getSeconds())
    ;
    return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
  };

  Date.prototype.fromDatetimeLocal = (function (BST) {
    // BST should not be present as UTC time
    return new Date(BST).toISOString().slice(0, 16) === BST ?
      // if it is, it needs to be removed
      function () {
        return new Date(
          this.getTime() +
          (this.getTimezoneOffset() * 60000)
        ).toISOString();
      } :
      // otherwise can just be equivalent of toISOString
      Date.prototype.toISOString;
  }('2006-06-06T06:06'));


  function publishPanelOpen() {
    console.log('--- publishPanelOpen--', value,$$props)
    close(false)
  }

  function onTimeInputFocus() {
    value = PostStatus.scheduled
  }
  async function doPublish() {
    console.log('---btn doPublish--', oldStatus, value, time)
    dispatch('doPublish', {status: value, time, changed: value !== oldStatus})
  }

  async function doQuitEdit() {
    const isQit = await quitEdit();
    isQit && close()
  }

  function close(toClose = true) {
    dispatch('openToggle', toClose);
    document.removeEventListener('click', close)
  }

  beforeUpdate(() => {
    console.log('---publishBtn beforeUpdate--')
  })

  afterUpdate(() => {
    console.log('---publishBtn afterUpdate--')
    if (!value) {
      if (isDraft) {
        value = PostStatus.published
      } else {
        value = oldStatus;
      }
    }
    if (isPublishing && !time) {
      if (isDraft) {
        time  = new Date().toDatetimeLocal()
      }else if (isScheduled && $$props.publishedTime) {
        time = new Date($$props.publishedTime).toDatetimeLocal()
      }
    }
    
  });
  
  onDestroy(() => {
    console.log('---publishBtn onDestroy--')
    value = '';
    time = '';
  });
</script>