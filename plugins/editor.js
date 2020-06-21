import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor/dist/ssr'
import {ImageExtend} from 'quill-image-extend-module'
// import { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } from 'quill-emoji'

  
VueQuillEditor.Quill.register('modules/ImageExtend', ImageExtend)
Vue.use(VueQuillEditor)
// Vue.use(QuillWatch)

