<template>
<div class="cell" @click="$router.push(`/post?id=${item.id}`)" >
  <div class="cell-main flex flex-start">
    <div class="cell-img" v-if="item.mainImage" >
      <v-img width="80px" height="80px" position="center center" :src="item.mainImage" :lazy-src="item.mainImage" >
      </v-img>
    </div>
    
    <div class="cell-content f1 mlm">
      <div class="cell-title bold" :class="{'red--text':item.isNotice==1}" ><v-icon v-if="item.isTop" midd class="red--text" >arrow_upward</v-icon>{{item.title}}</div>
      <div class="cell-desc">{{item.plainDetail}}</div>
    </div>
    
  </div>
  <div class="cell-bottom flex fb pbs">
    <div class="color-h f12">
      <span class="">{{item.createUser ? item.createUser.username : ''}}</span>
    </div>
    <div class="f12 color-h">
      <span class="mrm"><md-icon>insert_drive_file</md-icon> {{item.readCount}}</span>
      <span class="mrm"> <md-icon>thumb_up</md-icon>{{item.likeCount}}</span>
      <span> <md-icon>mode_comment</md-icon> {{item.commentCount}}</span>
    </div>
  </div>
  <md-divider></md-divider>
</div>
</template>

<script>
export default {
  props: {
    item: {}
  }
}
</script>

<style lang="scss" scoped>


.cell {
  width: 100%;
  padding:12px;
  background-color: white;
}
.cell-main {
  // height: 80px;
  min-height: 80px;
}
.cell-img {
  display: inline-block;
}
.cell-content {
  display: inline-block;
}
.cell-title {
  overflow:hidden; 

  text-overflow:ellipsis;

  display:-webkit-box; 

  -webkit-box-orient:vertical;

  -webkit-line-clamp:1;
  margin-bottom: 5px;
}
.cell-desc {
  overflow:hidden; 

  text-overflow:ellipsis;

  display:-webkit-box; 

  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
}
</style>
