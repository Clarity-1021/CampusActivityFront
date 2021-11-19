<style src="" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--菜单-->
    <LeftMenu />
    <TopToolBar />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <div class="DisplayRow-1">
          <v-btn class="mr-4" outlined small fab color="teal lighten-1" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div style="width: 120px; height: 100%" class="d-flex flex-column justify-center align-center">
            <div style="font-size: 18px">投稿</div>
            <div style="border: solid 2px; width: 75px; border-radius: 10px; border-color: rgba(26, 188, 156, 0.45)"></div>
          </div>
        </div>
        <UploadPaper />
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'paper',
    data(){
      return{

      };
    },
    methods:{
      // 返回上一个页面
      goBack(){
        this.$router.go(-1);
      },
    },
  }
</script>

