<style src="../../../../static/mycss/Lab3/UserConference/UserConference.css" lang="css" scoped></style>
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

          <!--选择排版-->
          <v-row style="margin: 0">
            <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column mandatory>
              <v-chip>卡片</v-chip>
              <v-chip>表格</v-chip>
            </v-chip-group>
          </v-row>

          <v-progress-linear :active="progressSearch" color="green darken-3" height="5" indeterminate></v-progress-linear>
          <!--卡片-->
          <v-data-iterator v-if="IsSelectionCard" :items="items" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
            <template v-slot:default="props">
              <v-row>
                <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
                  <v-card class="mx-auto">

                    <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

                    <v-card-title>{{item.FullName}}</v-card-title>

                    <v-card-text>
<!--                      <v-row align="center" class="mx-0">-->
<!--                        <v-rating-->
<!--                          :value="4.5"-->
<!--                          color="amber"-->
<!--                          dense-->
<!--                          half-increments-->
<!--                          readonly-->
<!--                          size="14"-->
<!--                        ></v-rating>-->

<!--                        <div class="grey&#45;&#45;text ms-4">-->
<!--                          4.5 (413)-->
<!--                        </div>-->
<!--                      </v-row>-->

<!--                      <div class="text-subtitle-1">-->

                      <v-row class="mx-0" align="left">
                        {{item.Hoster}}
                      </v-row>
                      <v-row class="mx-0" align="left">
                        {{item.StartTime}}
                      </v-row>
                      <v-row class="mx-0" align="left">
                        {{item.Place}}
                      </v-row>

                      <v-row class="mx-0 mt-3" align="left">
                        <v-chip>{{item.State}}</v-chip>
                      </v-row>

<!--                      </div>-->

<!--                      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>-->
                    </v-card-text>

                    <v-divider class="mx-4"></v-divider>

                    <v-card-actions>
                      <v-btn color="green" text @click="CheckDetail(item)">
                        查看详情
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

            </template>


            <template v-slot:footer>
              <v-pagination color="green darken-3" v-model="page" :length="numberOfPages" :total-visible="itemsPerPage"></v-pagination>
            </template>
          </v-data-iterator>
          <!--表格-->
          <div v-else style="width: 100%">
            <v-data-table sort-by="loanDate" sort-desc :headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer class="elevation-1" @page-count="numberOfPages">
              <template v-slot:item.cz="{ item }">
                <v-btn color="green" text @click="CheckDetail(item)">
                  查看详情
                </v-btn>
              </template>
            </v-data-table>
            <v-pagination class="mt-3" color="green darken-3" v-model="page" :length="numberOfPages" :total-visible="itemsPerPage"></v-pagination>
          </div>
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
        selection: 0,
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
        progressSearch: false,
        headers: [
          { text: '活动全称', value: 'FullName', sortable: false, align: 'center' },
          { text: '主办方', value: 'Hoster', sortable: false, align: 'center' },
          { text: '活动地点', value: 'Place', sortable: false, align: 'center' },
          { text: '开始日期', value: 'StartTime', sortable: true, align: 'center' },
          { text: '活动状态', value: 'State', sortable: false, align: 'center' },
          { text: '操作', value: 'cz', sortable: false, align: 'center' },
        ],
        page: 1,
        itemsPerPage: 12,
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

      CheckDetail (item) {
console.log(item.StartTime)
      },

      nextPage () {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage () {
        if (this.page - 1 >= 1) this.page -= 1
      },
      updateitemsPerPage (number) {
        this.itemsPerPage = number
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

