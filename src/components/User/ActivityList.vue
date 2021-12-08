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
            <div class="MenuBox-x-item" @click="refresh">活动列表</div>
            <div class="MenuBox-x-item" @click="goToOtherConference">推荐活动</div>
            <div class="MenuBox-xAnimation start-1"></div>
          </div>
        </div>

        <!--第2行/内容框-->
        <div class="DisplayRow-2">
          <!--搜索栏-->
          <v-row class="mt-6">
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-text-field color="green darken-3" dense outlined clearable label="活动名" v-model="SearchForm.FullName"></v-text-field>
            </v-col>
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-text-field color="green darken-3" dense outlined clearable label="主办方" v-model="SearchForm.Hoster"></v-text-field>
            </v-col>
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-select clearable menu-props="auto" color="green darken-3" outlined item-text="state" item-value="num" :items="SearchFormStateItems" label="状态" v-model="SearchForm.State" dense></v-select>
            </v-col>
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-btn @click="OnSearch" :loading="progressSearch" dark color="green darken-3">搜索</v-btn>
            </v-col>
          </v-row>
          <ActivityDisplay :items="items" />

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ActivityList',
    data(){
      return{
        number: -1,
        record:-1,
        currentPage:1,
        conferences:[],
        progressSearch: false,
        SearchForm: {
          FullName: '',
          Hoster: '',
          State: '',
        },
        SearchFormStateItems: [
          { state: '未开放报名', num: 1, },
          { state: '报名ing', num: 2, },
          { state: '报名截止', num: 3, },
          { state: '活动ing', num: 4, },
          { state: '活动结束', num: 5, },
        ],
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
            StartTime: '2021-12-01',
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
    },
    computed: {
      numberOfPages () {
        return Math.ceil(this.items.length / this.itemsPerPage)
      },
      IsSelectionCard () {
        return this.selection === 0;
      }
    },
    methods:{
      getInfo() {
        this.$axios.get('/submitting?page='+this.currentPage)
          .then(resp => {
            this.number = resp.data.number;
            this.record = resp.data.record;
            this.conferences = resp.data.conferences;
          })
          .catch(error => {
            console.log(error);
            if (error.response.data.record===0){
              this.number=0;
            } else {
              this.record=error.data.record;
              this.currentPage=Math.ceil(this.record/6);
            }
          });
      },

      // Todo
      OnSearch () {
        this.progressSearch = true;
        setTimeout(() => (this.progressSearch = false), 2000)
      },

      //刷新页面
      refresh() {
        this.$router.go(0);
      },

     // --------------------跳转--------------------

      //跳转其他会议
      goToOtherConference(){
        this.$router.push({path:'./HotActivity'});
      },

      //跳转会议详情
      goToConferenceDetail(conference_id){
        this.$router.push({path:'./ConferenceDetail?conference_id='+conference_id});
      },

      //跳转我的稿件
      goToPaper(conference_id){
        this.$router.push({path:'./Paper?conference_id='+conference_id});
      },
    },
  }
</script>

