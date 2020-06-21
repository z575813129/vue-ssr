<template>
  <div class="myInfo">
    <!--<div class="fixed">-->
    <!--<md-toolbar class="md-primary" md-swipeable>-->
    <!--<div @click="$router.go(-1)">-->
    <!--<md-icon class="white">arrow_back</md-icon>-->
    <!--</div>-->
    <!--<h2 class="md-title white" style="flex: 1">{{$route.query.title}}</h2>-->
    <!--</md-toolbar>-->
    <!--</div>-->
    <div>
      <div class="flex fb  p">
        <div class="flex relative">
          <span class="name">{{$t('common.avatar')}}: </span>
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="People" class="avatar">
          <img v-else src="~/assets/imgs/user.png" alt="People" class="avatar">
          <input type="file" class="file " accept="image/*" name="image/*"
                 @change="fetchUrl"/>
        </div>

        <span><md-icon class="">keyboard_arrow_right</md-icon></span>

      </div>
      <md-divider></md-divider>
      <div class="flex fb p">

        <div class="flex" v-if="userInfo">
          <span class="name">{{$t('common.username')}}: </span>
          <span>{{userInfo.username}}</span>
        </div>

        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider>
      <div class="flex fb p" @click="edit($t('common.birthday'), 'birthday', userInfo.birthday)">
        <div class="flex" v-if="userInfo" >
          <span class="name">{{$t('common.birthday')}}: </span>
          <span>{{birthday}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider>
      <div class="flex fb p">
        <div class="flex" v-if="userInfo" @click="edit($t('common.email'), 'email', userInfo.email)">
          <span class="name">{{$t('common.email')}}: </span>
          <span>{{userInfo.email || $t('common.email')}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider>
      <div class="flex fb p" @click="edit($t('common.gender'), 'gender', userInfo.gender)">
        <div class="flex" v-if="userInfo">
          <span class="name">{{$t('common.gender')}}: </span>
          <span>{{gender}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider>
      <!-- <div class="flex fb p">
        <div class="flex" v-if="userInfo">
          <span class="name">{{$t('common.phone')}}: </span>
          <span>{{userInfo.phone || $t('common.none')}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider> -->
      <div class="flex fb p ">

        <div class="flex" v-if="userInfo" @click="edit($t('common.sign'),'sign', userInfo.sign)">
          <span class="name">{{$t('common.sign')}}: </span>
          <span>{{userInfo.sign || $t('common.none')}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>
      </div>
      <md-divider></md-divider>
      <div class="flex fb p " @click="edit($t('my.info.passwordEdit'),'password', '')">
        <div class="flex">
          <span class="name">{{$t('my.info.passwordEdit')}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>

      </div>
      <md-divider></md-divider>
      <div class="flex fb p ">

        <div class="flex" @click="quit">
          <span class="name">{{$t('common.logout')}}</span>
        </div>
        <span><md-icon class="">keyboard_arrow_right</md-icon></span>

      </div>
      <md-divider></md-divider>

    </div>


    <md-dialog-prompt
      :md-active.sync="showDialog"
      v-model="value"
      :md-title="title"
      @md-confirm="save"
      @md-cancel="showDialog=false"
      :md-input-placeholder="$t('my.info.input')"
      :md-cancel-text="$t('common.cancel')"
      :md-confirm-text="$t('common.save')"/>


    <!-- <md-dialog :md-cancel-text="$t('common.cancel')" :md-confirm-text="$t('common.save')"
               :md-active.sync="showDateDialog" :md-fullscreen="false">
      <md-dialog-title>{{title}}</md-dialog-title>
      <div class="px">
        <md-datepicker v-model="value"/>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDateDialog=false">{{$t('common.close')}}</md-button>
        <md-button class="md-primary" @click="save">{{$t('common.save')}}</md-button>
      </md-dialog-actions>
    </md-dialog> -->


    <md-dialog :md-cancel-text="$t('common.cancel')" :md-confirm-text="$t('common.save')"
               :md-active.sync="showDateDialog" :md-fullscreen="false">
      <md-dialog-title>{{title}}</md-dialog-title>
      <div class="px">
        <md-datepicker v-model="value"/>
      </div>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showDateDialog=false">{{$t('common.close')}}</md-button>
        <md-button class="md-primary" @click="save">{{$t('common.save')}}</md-button>
      </md-dialog-actions>
    </md-dialog>


    <md-dialog :md-cancel-text="$t('common.cancel')" :md-confirm-text="$t('common.save')"
               :md-active.sync="showGenderDialog" :md-fullscreen="false">
      <div class="px">
        <md-dialog-title>{{title}}</md-dialog-title>
        <md-field>
          <md-select v-model="value">
            <md-option value="1">{{$t('common.male')}}</md-option>
            <md-option value="2">{{$t('common.female')}}</md-option>
          </md-select>
        </md-field>
        <md-dialog-actions>
          <md-button class="md-primary" @click="showGenderDialog=false">{{$t('common.close')}}</md-button>
          <md-button class="md-primary" @click="save">{{$t('common.save')}}</md-button>
        </md-dialog-actions>
      </div>
    </md-dialog>
    <v-dialog v-model="showEditPwd" >
      <v-card>
        <v-card-title class="headline">Change Password</v-card-title>

        <v-card-text>
          <v-form ref="editPwdForm" lazy-validation>
            <v-text-field
              :label="'Old password'"
              name="oldPwd"
              prepend-icon="lock"
              type="password"
              v-model="editPwdForm.oldPassword"
              :rules="editPwdRules.oldPassword"
              required
            />
            <v-text-field
              :label="'New password'"
              name="newPwd"
              prepend-icon="lock"
              type="password"
              v-model="editPwdForm.newPassword"
              :rules="editPwdRules.newPassword"
              required
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            @click="closeEditPwd"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            :loading="isEditPwd"
            @click="updatePassword"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import formDate from 'date-fns/format'

  export default {
    name: "myInfo",
    layout: 'vuetify',
    meta: {
      requireAuth: true
    },
    data() {
//      let dateFormat = this.$material.locale.dateFormat || 'yyyy-MM-dd'
      return {
        date: '',
        showGenderDialog: false,
        showDateDialog: false,
        title: this.$t('common.edit'),
        showDialog: false,
        key: '',
        value: null,
        avatar: '',
        showEditPwd: false,
        isEditPwd: false,
        editPwdForm: {
          oldPassword: '',
          newPassword: '',
        },
        editPwdRules: {
          oldPassword: [v => !!v || "Old password is required"],
          newPassword: [
            v => !!v || "new password is required",
            v => v.length >= 6 || "New password must be more than 6 char",
          ]
        }
      }
    },
    head() {
      return {
        title: this.$t('my.info.title')
      }
    },
    mounted() {
      this.$store.dispatch('userInfo')
    },
    computed: {
      userInfo() {
        return this.$store.state.userInfo;
      },
      birthday() {
        if (this.userInfo && this.userInfo.birthday) {
          return this.userInfo.birthday
        } else {
          return ''
        }
      },
      gender() {
        if (this.userInfo) {
          if (this.userInfo.gender == 1) {
            return this.$t('common.male')
          } else if (this.userInfo.gender == 2) {
            return this.$t('common.female')
          }
        }
        return this.$t('common.unknown')
      }
    },
    methods: {
      quit() {
        this.$store.dispatch('logout')
        this.$router.push('/')
      },
      edit(title, key, value) {
        this.key = key
        this.value = value
        this.title = title
        if (key === 'birthday') {
          this.showDateDialog = true
        } else if (key === 'gender') {
          this.showGenderDialog = true
        } else if (key == 'password'){
          this.showEditPwd = true
        } else {
          this.showDialog = true
        }
      },
      save() {
        if (this.key === 'sign') {
          this.updateSign()
        } else if (this.key === 'birthday') {
          this.updateBirthday()
        } else if (this.key === 'password') {
          this.updatePassword()
        } else if (this.key === 'gender') {
          this.updateGender()
        }
      },
      updateGender() {
        this.$axios.post('/api/v2/profile/updateGender', {gender: this.value * 1}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('common.editSuccess')})
          this.$store.dispatch('userInfo')
          
          this.showGenderDialog = false
        }).catch(e => {
        })
      },
      updatePassword() {
        if(this.$refs['editPwdForm'].validate()) {
          this.isEditPwd = true
          let data = {
            ...this.editPwdForm
          }
          this.$axios.post('/api/v2/profile/updatePassword', data).then(({data}) => {
            
            this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('common.editSuccess')})
            
          }).catch(e => {
          }).finally(() => {
            this.closeEditPwd()
          })
        }
        
      },
      closeEditPwd() {
        this.isEditPwd = false
        this.showEditPwd = false
        this.editPwdForm = {
          oldPassword: '',
          newPassword: ''
        }
        this.$refs['editPwdForm'].resetValidation()
      },
      updateSign() {
        this.$axios.post('/api/v2/profile/updateSign', {sign: this.value}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('common.editSuccess')})
          this.$store.dispatch('userInfo')
          
          this.showDialog = false
        }).catch(e => {
        })
      },
      updateBirthday() {
        if(this.value)  this.value=formDate(new Date(this.value), 'yyyy-MM-dd')
        console.log(this.value)
        this.$axios.post('/api/v2/profile/updateBirthday', {birthday: this.value}).then(({data}) => {
          
          this.$store.commit('SHOW_TOAST', {show: true, content: this.$t('common.editSuccess')})
          this.$store.dispatch('userInfo')
          
          this.showDateDialog = false
        }).catch(e => {
        })
      },
      // 压缩图片
      fetchUrl(e) {
        let file = e.target.files[0]
        const lrz = require('lrz')
        lrz(file).then(result => {
          let param = new FormData()
          param.append('file', result.file)
          this.$axios.post('/api/v2/profile/uploadImage', param).then(({data}) => {
            
            if (data) this.updateAvatar(data)
            
          }).catch(e => {
          })
        }).catch(console.error)
      },
      updateAvatar(url) {
        this.$axios.post('/api/v2/profile/updateAvatar', {avatar: url}).then(({data}) => {
          
          this.$store.dispatch('userInfo')
          
        }).catch(e => {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .myInfo {
    // margin: -12px;
    // position: absolute;
    // top: 0;
    height: 100%;
    width: 100%;
  }
  .md-dialog {
    max-width: 500px;
  }

  .name {
    display: block;
    width: 100px;
    margin-right: 20px;
  }

  .file {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 3;
    opacity: 0;
  }

  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
</style>
