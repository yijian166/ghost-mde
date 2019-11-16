<style type="text/less">
  .gm-box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .gm-box-navbar {
    height: 50px;
  }
  .gm-box-body {
    flex: 1;
  }
</style>
<div class="gm-box">
  <div class="gm-box-navbar"><slot name="header"></slot></div>
  <div class="gm-box-body">
    <slot name="body"></slot>
  </div>
</div>
