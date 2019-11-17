<style global src="./editor.css">
</style>
<div class="md-editor" bind:this={editorBoxElement}>
  <textarea bind:this={textAreaElement} />
</div>
<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>
<script>
  import SimpleMDE from 'simplemde'
  import { onMount, afterUpdate } from 'svelte';
  import debounce from 'lodash/debounce';
  import 'simplemde/dist/simplemde.min.css'
  import 'codemirror/lib/codemirror.css'
   import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let editorBoxElement;
  let textAreaElement;
  let editor;
  let innerWidth = 0;
  let innerHeight = 0;

  const ToolBarFuncs = ['toggleBold',
    'toggleItalic',
    'toggleStrikethrough',
    'toggleBlockquote',
    'toggleHeadingSmaller',
    'toggleHeadingBigger',
    'toggleHeading1',
    'toggleHeading2',
    'toggleHeading3',
    'toggleCodeBlock',
    'toggleUnorderedList',
    'toggleOrderedList',
    'cleanBlock',
    'drawLink',
    'drawImage',
    'drawTable',
    'drawHorizontalRule',
    'undo',
    'redo',
    'togglePreview',
    'toggleSideBySide',
    'toggleFullScreen'].reduce((pre, cur) => {
    pre[cur] = SimpleMDE[cur];// as ((editor: Types.SimpleMarkdownEditor) => void);
    return pre;
  }, {});

  const fullToolBar = {
    'bold': {
      name: 'bold',
      action: ToolBarFuncs.toggleBold,
      className: 'fa fa-bold',
      title: 'Bold',
    },
    'italic': {
      name: 'italic',
      action: ToolBarFuncs.toggleItalic,
      className: 'fa fa-italic',
      title: 'Bold',
    },
    'strikethrough': {
      name: 'strikethrough',
      action: ToolBarFuncs.toggleStrikethrough,
      className: 'fa fa-strikethrough',
      title: 'Strikethrough'
    },
    'heading': {
      name: 'heading',
      action: ToolBarFuncs.toggleHeadingSmaller,
      className: 'fa fa-header',
      title: 'Heading',
    },
    'heading-smaller': {
      name: 'heading-smaller',
      action: ToolBarFuncs.toggleHeadingSmaller,
      className: 'fa fa-header fa-header-x fa-header-smaller',
      title: 'Smaller Heading'
    },
    'heading-bigger': {
      name: 'heading-bigger',
      action: ToolBarFuncs.toggleHeadingBigger,
      className: 'fa fa-header fa-header-x fa-header-bigger',
      title: 'Bigger Heading'
    },
    'heading-1': {
      name: 'heading-1',
      action: ToolBarFuncs.toggleHeading1,
      className: 'fa fa-header fa-header-x fa-header-1',
      title: 'Big Heading'
    },
    'heading-2': {
      name: 'heading-2',
      action: ToolBarFuncs.toggleHeading2,
      className: 'fa fa-header fa-header-x fa-header-2',
      title: 'Medium Heading'
    },
    'heading-3': {
      name: 'heading-3',
      action: ToolBarFuncs.toggleHeading3,
      className: 'fa fa-header fa-header-x fa-header-3',
      title: 'Small Heading'
    },
    // 'separator-1': {
    //   name: 'separator-1'
    // },
    'code': {
      name: 'code',
      action: ToolBarFuncs.toggleCodeBlock,
      className: 'fa fa-code',
      title: 'Code'
    },
    'quote': {
      name: 'quote',
      action: ToolBarFuncs.toggleBlockquote,
      className: 'fa fa-quote-left',
      title: 'Quote',
    },
    'unordered-list': {
      name: 'unordered-list',
      action: ToolBarFuncs.toggleUnorderedList,
      className: 'fa fa-list-ul',
      title: 'Generic List',
    },
    'ordered-list': {
      name: 'ordered-list',
      action: ToolBarFuncs.toggleOrderedList,
      className: 'fa fa-list-ol',
      title: 'Numbered List',
    },
    'clean-block': {
      name: 'clean-block',
      action: ToolBarFuncs.cleanBlock,
      className: 'fa fa-eraser fa-clean-block',
      title: 'Clean block'
    },
    // 'separator-2': {
    //   name: 'separator-2'
    // },
    'link': {
      name: 'link',
      action: ToolBarFuncs.drawLink,
      className: 'fa fa-link',
      title: 'Create Link',
    },
    'image': {
      name: 'image',
      action: ToolBarFuncs.drawImage,
      className: 'fa fa-picture-o',
      title: 'Insert Image',
    },
    'choose-image': {
      name: 'choose-image',
      action(editor) {
        if (!editor._fileInputEl) {
          return false;
        }
        const el = editor._fileInputEl;
        el.addEventListener('change', onChange);
        el.click();
        async function onChange(e) {
          try {
            const target = (e).target;
            const files = target.files;
            if (files && files.length > 0) {
              const file = files[0];
              const url = await editor._fileUploadFun(file); //TODO:
              const cm = editor.codemirror;
              const stat = editor.getState();
              editor._replaceSelection(cm, stat.image, ['![](', '#url#)'], url);
            }
          } catch (error) {
          }
        }
      },
      className: 'fa fa-picture-o',
      title: 'Choose Local Image',
    },
    'table': {
      name: 'table',
      action: ToolBarFuncs.drawTable,
      className: 'fa fa-table',
      title: 'Insert Table'
    },
    'horizontal-rule': {
      name: 'horizontal-rule',
      action: ToolBarFuncs.drawHorizontalRule,
      className: 'fa fa-minus',
      title: 'Insert Horizontal Line'
    },
    // 'separator-3': {
    //   name: 'separator-3'
    // },
    'preview': {
      name: 'preview',
      action: ToolBarFuncs.togglePreview,
      className: 'fa fa-eye no-disable',
      title: 'Toggle Preview',
    },
    'side-by-side': {
      name: 'side-by-side',
      action: ToolBarFuncs.toggleSideBySide,
      className: 'fa fa-columns no-disable no-mobile',
      title: 'Toggle Side by Side',
    },
    'fullscreen': {
      name: 'fullscreen',
      action: ToolBarFuncs.toggleFullScreen,
      className: 'fa fa-arrows-alt no-disable no-mobile',
      title: 'Toggle Fullscreen',
    },
    // 'separator-4': {
    //   name: 'separator-4'
    // },
    'guide': {
      name: 'guide',
      action: 'https://simplemde.com/markdown-guide',
      className: 'fa fa-question-circle',
      title: 'Markdown Guide',
    },
    // 'separator-5': {
    //   name: 'separator-5'
    // },
    'undo': {
      name: 'undo',
      action: ToolBarFuncs.undo,
      className: 'fa fa-undo no-disable',
      title: 'Undo'
    },
    'redo': {
      name: 'redo',
      action: ToolBarFuncs.redo,
      className: 'fa fa-repeat no-disable',
      title: 'Redo'
    }
  };
  const fullToolBarKey = Object.entries(fullToolBar).reduce((pre,[key, value]) => {
    let _className = `md-icon md-icon-${key}`;
    if (value.className && value.className.includes('no-disable')) {
      _className += ' no-disable';
    }
    if (value.className && value.className.includes('no-mobile')) {
      _className += ' no-mobile';
    }
    value.className = _className;
    pre.set(key, value);
    return pre;
  }, new Map());
  const separator = '|';

  const defaultToolBar = [
    'bold',
    'italic',
    'strikethrough',
    separator,
    'heading-1',
    'heading-2',
    'heading-3',
    separator,
    'quote',
    'unordered-list',
    'ordered-list',
    separator,
    'link',
    'table',
    separator,
    'image',
    'choose-image',
    separator,
    'preview'
  ];

  const setEditorSize = debounce((innerWidth, innerHeight) => {
    // console.warn('----setEditorSize', innerWidth, innerHeight, $$props.topHeight , $$props.bottomHeight);
    // return
    const editorW = innerWidth - 300 - 20 -20;
    const editorH = innerHeight - 51 - 34 - ($$props.topHeight || 0) - ($$props.bottomHeight || 0); 
    if (editorBoxElement) {
      const _editorMirror = editorBoxElement.querySelector('.CodeMirror');
      console.log('---_editorMirror',_editorMirror, editorW)
      if (_editorMirror) {
        _editorMirror.style.width = editorW + 'px';
         _editorMirror.style.height = editorH + 'px';
      }
    }
  }, 1000);
  $: {
    console.log('----size update----')
    setEditorSize(innerWidth, innerHeight)
  }
  onMount(() => {
    const toolbar = defaultToolBar.map(item => {
      if (typeof item === 'string') {
        if (item === separator) {
          return item;
        } else {
          if (fullToolBarKey.get(item)) {
            return fullToolBarKey.get(item);
          } else {
            return null;
          }
        }
      } else if (typeof item === 'object') {
        const { name, action, className } = item;
        const _item = fullToolBarKey.get(name);
        const _className = _item ? _item.className : '';
        if (!name || typeof name !== 'string') {
          console.warn(`toolbar config error，${item} name not  string`);
          return null;
        }
        if (_item) {
          // tool Name rewrite
          if (name === 'guide') {
            if (!action || typeof action !== 'string') {
              item.action = _item.action;
            }
          } else if (!action || typeof action !== 'function') {
            item.action = _item.action;
          }
        } else {
          // custom toolbar
          if (typeof className !== 'string' || (!className && !_className)) {
            console.warn(`toolbar config error，${item} className not exist`);
            return null;
          }

          if (!action || typeof action !== 'function') {
            console.warn(`toolbar config error，${item} action not a function`);
            return null;
          }
        }
        item.className = item.className ? item.className : _className;
        return item;
      }
      return null;
    }).filter(item => item);
    editor = new SimpleMDE({ element: textAreaElement, spellChecker: false, toolbar, autoDownloadFontAwesome: false });
    dispatch('open', editor);
    setEditorSize()
    setMDValue()
    return () => {
      dispatch('close');
    }
  });

  afterUpdate(() => {
    setMDValue()
  });

  function setMDValue() {
    if ($$props.markdown && editor) {
      editor.value($$props.markdown)
    }
  }
  
</script>