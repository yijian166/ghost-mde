<style type="text/less" global>
@hs: 1,2,3,4,5,6;
.gm-html-box {
  /* width: 100%; */
  padding-right: 10px;
}
article {
  /* overflow-x: auto; */
  
  each(@hs, {
    h@{value} {
      font-size: 26px - (@value - 1) * 2;
      margin-bottom: 10px;
      font-weight: bold;
    }
  });

  p {
    line-height: 1.48;
    margin-bottom: 10px;
  }
  pre {
    margin-bottom: 10px;
    /* width: 100%; */
    /* overflow: auto; */
  }
  code {
  }

  ul,ol {
    padding-left: 40px;
  }
  ul {
    list-style: circle
  }
  ol {
    list-style: decimal;
  }

  & > ul ,
  & > ol {
    margin-bottom: 10px;
  }

  img {
    max-width: 100%;
    
  }
  em {
    font-style: italic!important;
  }
  b, 
  strong {
    font-weight: bolder!important;
  }
  p {
    margin-bottom: 15px;
  }

  blockquote {
    padding: 0 1rem;
    margin-left: 0;
    color: #819198;
    border-left: .3rem solid #dce6f0;
  }
}

</style>
<div class="gm-html-box">
  <article>
    {@html $$props.postHTML || '' }
  </article>
</div>
