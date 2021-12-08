<style src="../../../static/mycss/Lab3/MyConference/MyConference.css" scoped></style>
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
            <div class="MenuBox-x-item" @click="refresh">我创建的</div>
            <div class="MenuBox-x-item" @click="goToMyConferenceAttend">我参与的</div>
            <div class="MenuBox-xAnimation start-1"></div>
          </div>
        </div>
        <!--第2行/内容框-->
        <div class="DisplayRow-2">
          <ActivityDisplay :items="items" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MyActivityCreated',
    data() {
      return {
        number: -1,
        record:-1,
        currentPage:1,
        conferences:[],
        items: [
          {
            FullName: '活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '开始日期七个字',
            State: '状态'
          },
          {
            FullName: '活动名称七个字',
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
      this.$refs.calendar.checkChange()
    },

    methods: {
      getInfo() {
        this.$axios.get('/myConferenceChair?page='+this.currentPage)
          .then(resp => {
            this.number = resp.data.number;
            this.record = resp.data.record;
            this.conferences = resp.data.conferences;
          })
          .catch(error => {
              if (error.data.record===0){
                this.number=0;
              } else {
                this.record=error.data.record;
                this.currentPage=Math.ceil(this.record/10);
              }
              console.log(error);

          });

      },

      //刷新页面
      refresh() {
        this.$router.go(0);
      },

      // --------------------跳转--------------------

      //跳转参与的会议
      goToMyConferenceAttend() {
        this.$router.push({path: './MyActivityAttend'});
      },

      //跳转主席页面
      goToChair(conference_id) {
        this.$router.push({path: './Chair?conference_id='+conference_id});
      },

    },
  }
</script>

