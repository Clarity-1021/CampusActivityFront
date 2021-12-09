<style src="../../../static/mycss/Lab3/UserConference/UserConference.css" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--菜单-->
    <LeftMenu current-menu-item="AllConference" />
    <TopToolBar current-menu-item="AllConference" />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <!--第1行/抬头-->
        <div class="DisplayRow-1">
          <div class="MenuBox-x">
            <div class="MenuBox-x-item" @click="goToContribute">活动列表</div>
            <div class="MenuBox-x-item" @click="refresh">推荐活动</div>
            <div class="MenuBox-xAnimation start-2"></div>
          </div>
        </div>
        <!--第2行/内容框-->
        <div class="DisplayRow-2">
          <div class="my-3" style="width: 100%">
            <v-carousel v-model="model">
              <v-carousel-item
                v-for="(picture, i) in pictures"
                :key="i"
                :src="picture"
              >
              </v-carousel-item>
            </v-carousel>
          </div>
        </div>
        <div class="DisplayRow-2">
          <ActivityDisplay :mode="'LookDetail'" :items="items" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'HotActivity',
    data(){
      return{
        number: -1,
        record:-1,
        currentPage:1,
        conferences:[],
        model: 0,
        pictures : [
          '../../../static/images/ActivityPics/PlayCards.jpg',
          '../../../static/images/ActivityPics/SayHello.jpg',
          '../../../static/images/ActivityPics/EatChips.jpg',
          '../../../static/images/ActivityPics/DiaoFish.jpg'
        ],
        items: [
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
            State: '状态'
          },
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
            State: '状态'
          },
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
            State: '状态'
          },
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
            State: '状态'
          },
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
            State: '状态'
          },
          {
            FullName: '热门活动名称七个字',
            Hoster: '主办方六个字',
            Place: '地点五个字',
            StartTime: '2021-2-2',
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
        this.$axios.get('/others?page='+this.currentPage)
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
      //跳转投稿
      goToContribute(){
        this.$router.push({path:'./ActivityList'});
      },

      //跳转会议详情
      goToConferenceDetail(conference_id){
        this.$router.push({path:'./ConferenceDetail?conference_id='+conference_id});
      },

      //跳转我的稿件
      goToPaper(){
        this.$router.push({path:'./Paper'});
      },
    },
  }
</script>

