<style src="../../../static/mycss/Lab3/MyConference/MyConference.css" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--菜单-->
    <LeftMenu current-menu-item="MyConference" />
    <TopToolBar current-menu-item="MyConference" />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <!--第1行/抬头-->
        <div class="DisplayRow-1">
          <div class="MenuBox-x">
            <div class="MenuBox-x-item" @click="goToMyConference">我创建的</div>
            <div class="MenuBox-x-item" @click="refresh">我参与的</div>
            <div class="MenuBox-xAnimation start-2"></div>
          </div>
        </div>
        <!--第2行/内容框-->
        <div class="DisplayRow-2">
          <ActivityDisplay :mode="'SignUp'" :items="items" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MyActivityAttend',
    data(){
      return{
        items: [
          {
            FullName: '1活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '2活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '3活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '4活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
        ]
      };
    },
    mounted() {
      this.getInfo()
    },
    methods:{
      getInfo() {
        this.$axios.get('/myConferenceNotChair?page='+this.currentPage)
          .then(resp => {
            this.number = resp.data.number;
            this.record = resp.data.record;
            this.conferences = resp.data.conferences;
          })
          .catch(error => {
              if (error.response.data.record===0){
                this.number=0;
              } else {
                this.record=error.data.record;
                this.currentPage=Math.ceil(this.record/6);
              }
              console.log(error);
          });
      },

      //刷新页面
      refresh() {
        this.$router.go(0);
      },

      // --------------------跳转--------------------
      //跳转我的会议
      goToMyConference(){
        this.$router.push({path: './MyActivityCreated'});
      },

      //跳转程序委员会委员
      goToPCMember(conference_id,conference_stage){
        this.$router.push({path: './PCMember?conference_id='+conference_id});
      },

      //跳转作者
      goToAuthor(conference_id,conference_stage){
        this.$router.push({path: './Author?conference_id='+conference_id});
      }
    },
  }
</script>

