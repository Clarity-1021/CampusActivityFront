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
          <v-row style="width: 100%">
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-text-field color="green darken-3" dense outlined clearable label="客户证件号" v-model="form.khh"></v-text-field>
            </v-col>
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-select clearable menu-props="auto" color="green darken-3" outlined item-text="state" item-value="num" :items="items" label="账单情况" v-model="form.dkzt" dense></v-select>
            </v-col>
            <v-col xs="12" sm="4" md="4" lg="3" cols="12">
              <v-btn @click="searchAccount" :loading="progressSearch" dark color="green darken-3">搜索</v-btn>
            </v-col>
          </v-row>

          <div style="width: 100%; min-width: 950px">
            <v-progress-linear :active="progressSearch" dark color="green" indeterminate height="5"></v-progress-linear>
            <v-data-table sort-by="loanDate" sort-desc :headers="headers" :items="tableData" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer class="elevation-1" @page-count="pageCount = $event">
              <!--操作栏-->
              <template v-slot:item.cz="{ item }">
                <v-icon title="查看账单" color="green darken-3" small class="mx-1" @click="checkBillDetail(item)">mdi-clipboard-text-search-outline</v-icon>
                <!--                            <v-icon small title="贷款详情" color="green darken-3" class="mx-1" @click="checkLoanDetail(item)">mdi-clipboard-text-outline</v-icon>-->
                <v-icon :disabled="item.loanStatus === '未发放' || item.loanSettleStatus === 2" small title="提前还款" color="green darken-3" class="mx-1" @click="repayAll(item)">mdi-clipboard-check-multiple-outline</v-icon>
              </template>
            </v-data-table>
          </div>
          <div class="mt-3">

            <v-pagination color="green darken-3" v-model="page" :length="pageCount" :total-visible="10"></v-pagination>
          </div>

          <v-container class="displayConfDetail">
            <v-row justify="center">
              <v-expansion-panels popout>
                <v-expansion-panel hide-actions>
                  <v-expansion-panel-header><!--简要条目陈列-->
                    <template v-slot:actions>
                      <v-icon>mdi-card-bulleted</v-icon>
                    </template>
                    <v-row align="center" class="spacer" no-gutters>
                      <v-col class="text-center" cols="1">
                        <span>主席</span>
                      </v-col>
                      <v-col class="text-center" cols="3">
                        <span>全称</span>
                      </v-col>
                      <v-col class="text-center" cols="2">
                        <span>地点</span>
                      </v-col>
                      <v-col class="text-center" cols="3">
                        <span>开始日期</span>
                      </v-col>
                      <v-col class="text-center" cols="3">
                        <span>投稿</span>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                </v-expansion-panel>

                <v-expansion-panel hide-actions v-if="number === 0">
                  <v-expansion-panel-header><!--简要条目陈列-->
                    <template v-slot:actions>
                      <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
                    </template>
                    <v-row align="center" class="spacer" no-gutters>
                      <v-col class="text-center" cols="12">
                        <strong>没有任何会议正在投稿</strong>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                </v-expansion-panel>

                <v-expansion-panel v-for="conference in conferences" :key="conference" hide-actions><!--会议条目循环-->
                  <v-expansion-panel-header><!--简要条目陈列-->
                    <v-row align="center" class="spacer" no-gutters>
                      <v-col class="text-center textOverFlowHidden" cols="1">
                        <strong title="点击显示会议详情" v-html="conference.chair_name"></strong>
                      </v-col>
                      <v-col class="text-center textOverFlowHidden" cols="3">
                        <strong title="点击显示会议详情" v-html="conference.fullname"></strong>
                      </v-col>
                      <v-col class="text-center textOverFlowHidden" cols="2">
                        <strong title="点击显示会议详情" v-html="conference.place"></strong>
                      </v-col>
                      <v-col class="text-center textOverFlowHidden" cols="3">
                        <strong title="点击显示会议详情" v-html="conference.start_time"></strong>
                      </v-col>
                      <v-col class="text-center d-flex justify-center" cols="3">
                        <el-button style="color: white" v-if="conference.is_chair==='false'" class="recBtn-medium" type="primary" size="small" @click="goToPaper(conference.conference_id)">投稿</el-button>
                        <el-button style="color: white" v-if="conference.is_chair==='true'" class="recBtn-medium" type="info" disabled size="small" @click="goToPaper(conference.conference_id)">投稿</el-button>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content><!--展开文本-->
                    <v-divider></v-divider><!--分割线-->
                    <v-card-text>
                      <v-row class="text-justify">
                        <v-col cols="6">主席：{{conference.chair_name}}</v-col>
                        <v-col cols="6">举办地点：{{conference.place}}</v-col>
                      </v-row>
                      <v-row class="text-justify">
                        <v-col cols="6">简称：{{conference.abbr}}</v-col>
                        <v-col cols="6">全称：{{conference.fullname}}</v-col>
                      </v-row>
                      <v-row class="text-justify">
                        <v-col cols="12">会议日期：{{conference.start_time}} ~ {{conference.end_time}}</v-col>
                      </v-row>
                      <v-row class="text-justify">
                        <v-col cols="12" v-if="conference.submission_begin===undefined">投稿日期：未定 ~ {{conference.submission_ddl}}</v-col>
                        <v-col cols="12" v-if="conference.submission_begin!==undefined">投稿日期：{{conference.submission_begin}} ~ {{conference.submission_ddl}}</v-col>
                      </v-row>
                      <v-row class="text-justify">
                        <v-col cols="6">评审发布日期：{{conference.publish_time}}</v-col>
                      </v-row>
                      <v-row class="text-justify">
                        <v-col cols="12">话题：
                          <el-tag type="success" style="margin: 3px" :key="tag" v-for="tag in JSON.parse(conference.topics)">
                            {{tag}}
                          </el-tag></v-col>
                      </v-row>
                    </v-card-text>
                  </v-expansion-panel-content>

                </v-expansion-panel>
              </v-expansion-panels>
            </v-row>
          </v-container>
        </div>
        <!--第3行/页码-->
        <div class="DisplayRow-3">
          <el-pagination background @current-change="getInfo" :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total.sync='record'></el-pagination>
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
      };
    },
    mounted() {
      this.getInfo()
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

