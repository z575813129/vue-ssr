<template>
  <div id="main">
    <v-form ref="form">
      <div id="select">
        <v-select
         label="Category"
         :items="categories"
         :item-value="item => item.code"
         :item-text="item => $t('common.categories.'+item.code)"
         :menu-props="{'maxHeight':500}"
         v-model="category"
         :rules="rules.category"
         required
         :placeholder="$t('my.postCreate.chooseCategory')"
         autofocus
        >
          
        </v-select>
      </div>
      <div>
        <v-text-field
          label="Title"
          name="title"
          type="text"
          counter="60"
          :hint="$t('my.postCreate.titleInput')"
          :placeholder="$t('my.postCreate.titleInput')"
          v-model="title"
          :rules="rules.title"
          clearable
          required
        />
      </div>
      <div class="textarea">
        <div class="quill-editor"
           :content="detail"
           @change="onEditorChange($event)"
           @blur="onEditorBlur($event)"
           @focus="onEditorFocus($event)"
           @ready="onEditorReady($event)"
           v-quill:myQuillEditor="editorOption">
        </div>
      </div>
    </v-form>
    <div>
      <v-btn color="primary" width="100%" @click="check" >
        {{$t('my.postCreate.submit')}}
      </v-btn>
    </div>
    <md-dialog-confirm
      :md-active.sync="showDialog"
      :md-title="$t('common.tips')"
      :md-content="$t('my.postCreate.submitContent')"
      :md-confirm-text="$t('common.confirm')"
      :md-cancel-text="$t('common.cancel')"
      @md-cancel="showDialog = false"
      @md-confirm="complete"/>
  </div>
</template>

<script>
  export default {
    name: "myPostCreate",
    meta: {
      requireAuth: true
    },
    components: {},
    layout: 'vuetify',
    head() {
      return 'BAAC - Create Post'
    },
    data() {
      return {
        category: null,
        detail: '', // 富文本
        plainDetail: '', // 列表描述
        mainImage: '',
        images: [],
        imageArr: [],
        rules: {
          category: [
            v => !!v || 'Required'
          ],
          title: [
            v => !!v || "Required",
            v => v.length >= 5 || "Min 5 characters",
            v => v.length <= 60 || "Max 60 characters"
          ]
        },
        editorOption: {
          // some quill options
          modules: {
            toolbar: {
              container: [
                ['image'],
                ['bold', 'italic', 'underline', 'strike'],
                // ['blockquote', 'code-block'],
                // ['emoji']
              ],
              handlers: {
                'image': function(...arg) {
                  const {QuillWatch} = require('quill-image-extend-module')
                  QuillWatch.emit(this.quill.id)
                }
              },
            },
            // "emoji-toolbar": true,
            // "emoji-textarea": true,
            // "emoji-shortname": true,
            ImageExtend: {
              loading: true,
              name: 'file',
              size: 4,
              action: '/api/v2/post/uploadImage',
              response: (res) => {
                console.log(res)
                return res.path
              },
              headers: (xhr) => {
                if (this.$store) {
                  const {isAuth, accessToken} = this.$store.state
                  if (isAuth && accessToken) {
                    xhr.setRequestHeader('Authorization', accessToken)
                  }
                }

              // xhr.setRequestHeader('myHeader','myValue')
              },  // 可选参数 设置请求头部
              sizeError: (e) => {
                this.$store.commit('SHOW_TOAST', {show: true, content: 'Image size must be less than 4Mb'})
              },  // 图片超过大小的回调
              start: () => {},  // 可选参数 自定义开始上传触发事件
              end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
              error: () => {
                this.$store.commit('SHOW_TOAST', {show: true, content: 'Upload image fail'})
              },  // 可选参数 上传失败触发的事件
              success: () => {},  // 可选参数  上传成功触发的事件
            },
          },
        },
        showDialog: false,
        title: '',
        info: null
      }
    },
    computed: {
      categories() {
        return this.$store.state.categories
      }
    },
    mounted() {
      // if (this.QuillWatch == null) {

      //   this.QuillWatch = QuillWatch
      // }
    },
    methods: {
      check() {
        if (!this.$refs['form'].validate()) {
          return
        }
        this.getImages()
        console.log(this.category)
        console.log(this.title)
        if (this.title && this.category && this.detail) {
          // console.log(this.myQuillEditor)
          this.showDialog = true
        } else {
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('my.postCreate.checkFail')})
        }
      },
      imagehander() {
        const {QuillWatch} = require('quill-image-extend-module')

        console.log(this)
        QuillWatch.emit(this.quill.id)
      },
      deleteItem(item, index) {
        item.show = !item.show
        this.$delete(this.images, index)
      },
      // 压缩图片
      fetchUrl(e) {
        let file = e.target.files[0]
        let param = new FormData()
        param.append('file', file)
        // param.append('fileLen', file.size)
        this.$axios.post('/api/v2/post/uploadImage', param).then(({data}) => {
          
          let item = {
            src: data,
            // src: 'https://cn.bing.com/th?id=OHR.MauiEucalyptus_ZH-CN5616197787_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp',
            show: false
          }
          
          this.images.unshift(item)
        }).catch(e => {
        })
      },
      complete() {
        // let arr = []
        // if (this.images.length) {
        //   for (let item of this.images) {
        //     arr.push(item.src)
        //   }
        // }
        this.$axios.post('/api/v2/post/create', {
          "category": this.category,
          "detail": this.detail,
          // "images": arr.length ? arr.join(',') : '',
          images: this.imageArr.join(','),
          "mainImage": this.mainImage,
          "plainDetail": this.plainDetail,
          "title": this.title
        }).then(({data}) => {
         
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('my.postCreate.submitSuccess')})
          this.showDialog = false
          this.$router.replace('/post?id='+data)
          
        }).catch(console.error)
      },
      onEditorBlur(editor) {
        // console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        // console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        // console.log('editor ready!', editor)
      },
      onEditorChange(editor) {
        const {quill, html, text} = editor
        this.detail = html
        this.plainDetail = text
      },
      getImages() {
        const ops = this.myQuillEditor.getContents()['ops']
        if (ops) {
          const images = [];
          ops.forEach(element => {
            if (!element) {
              return;
            }
            const insert = element['insert']
            if (!insert || !(insert instanceof Object))
              return;
            const image = insert['image']
            if (!image)
              return;
            images.push(image)
          });
          this.imageArr = images
          if (images.length > 0) {
            this.mainImage = images[0]
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
#main {
  height: 100%;
  width: 100%;
  padding: 10px;
  overflow: auto;
}
.textarea {
  width: 100%;
  margin: 16px auto;

  .quill-editor {
    min-height: 300px;
    max-height: 800px;
    overflow-y: auto;
  }
}
</style>
