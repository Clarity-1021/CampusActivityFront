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

          <v-row>
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

          <!--展示病床信息-->
          <v-data-iterator :items="items" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
            <template v-slot:header>
              <v-toolbar dark color="blue darken-3" class="mb-1">

                <span>每页病床数量</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn light text color="white" class="ml-2" v-bind="attrs" v-on="on">
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateitemsPerPage(number)">
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

                <v-spacer></v-spacer>

                <span class="mr-4">
              第 {{ page }} 页 共 {{ numberOfPages }} 页
          </span>
                <v-btn light fab small class="mr-1" @click="formerPage">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn fab light small class="ml-1" @click="nextPage">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>

              </v-toolbar>
            </template>

            <template v-slot:default="props">
              <v-row>
                <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
                  <v-card>
                    <v-card-title class="subheading font-weight-bold">
                      {{ item.id }}
                    </v-card-title>

                    <v-divider></v-divider>

                    <v-list dense>
                      <v-list-item>
                        <v-list-item-content class="font-weight-bold">
                          病人
                        </v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.patient.name }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>

          <div style="width: 100%">
            <v-progress-linear :active="progressSearch" dark color="green" indeterminate height="5"></v-progress-linear>

            <v-card
              :loading="progressSearch"
              class="mx-auto my-12"
              max-width="374"
            >
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-img
                height="250"
                src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
              ></v-img>

              <v-card-title>活动名字七个字</v-card-title>

              <v-card-text>
                <v-row
                  align="center"
                  class="mx-0"
                >
                  <v-rating
                    :value="4.5"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                  ></v-rating>

                  <div class="grey--text ms-4">
                    4.5 (413)
                  </div>
                </v-row>

                <div class="my-4 text-subtitle-1">
                  $ • Italian, Cafe
                </div>

                <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-title>Tonight's availability</v-card-title>

              <v-card-text>
                <v-chip-group
                  v-model="selection"
                  active-class="deep-purple accent-4 white--text"
                  column
                >
                  <v-chip>5:30PM</v-chip>

                  <v-chip>7:30PM</v-chip>

                  <v-chip>8:00PM</v-chip>

                  <v-chip>9:00PM</v-chip>
                </v-chip-group>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="deep-purple lighten-2"
                  text
                  @click="reserve"
                >
                  Reserve
                </v-btn>
              </v-card-actions>
            </v-card>
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
          { text: '借据号', value: 'iouNum', sortable: false, align: 'center' },
          { text: '客户号', value: 'customerCode', sortable: false, align: 'center' },
          { text: '客户名', value: 'customerName', sortable: false, align: 'center' },
          { text: '贷款状态', value: 'loanStatus', sortable: false, align: 'center' },
          { text: '贷款产品', value: 'productName', sortable: false, align: 'center' },
          { text: '贷款产品编号', value: 'productCode', sortable: false, align: 'center' },
          { text: '逾期金额（元）', value: 'overdueBalance', sortable: false, align: 'center' },
          { text: '发放日期', value: 'loanDate', align: 'center' },
          { text: '操作', value: 'cz', sortable: false, align: 'center' },
        ],
        itemsPerPageArray: [4, 8, 12],
        page: 1,
        itemsPerPage: 4,
        items: [
          {
            id: '123',
            patient: {
              id: '1',
              name: '小李'
            }
          },
          {
            id: '1234',
            patient: {
              id: '2',
              name: '小三'
            }
          },
          {
            id: '1233',
            patient: {
              id: '5',
              name: '小搜'
            }
          },
          {
            id: '1323',
            patient: {
              id: '6',
              name: '小无'
            }
          },
          {
            id: '1323',
            patient: {
              id: '7',
              name: '小留'
            }
          }
        ]
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

