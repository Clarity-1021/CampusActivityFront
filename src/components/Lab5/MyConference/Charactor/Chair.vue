<style src="../../../../../static/mycss/Lab3/MyConference/Charactor/Chair.css" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--菜单-->
    <LeftMenu />
    <TopToolBar />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <v-tabs v-model="tab" color="#1abc9c" background-color="transparent" show-arrows>
          <v-tab>开启投稿</v-tab>
          <v-tab>开启初审</v-tab>
          <v-tab>发布初审结果</v-tab>
          <v-tab>终审情况</v-tab>
          <v-tab>发布终审结果</v-tab>
          <v-tab>所有投稿</v-tab>
          <v-tab>程序委员会</v-tab>
          <v-tab>邀请委员</v-tab>
          <v-tab>初审</v-tab>
          <v-tab>终审</v-tab>

          <v-tabs-items v-model="tab">
            <!--开启投稿-->
            <v-tab-item>
              <v-row class="d-flex justify-center mt-8">
                <el-button v-if="status==='close'" class="recBtn-medium" type="primary" plain @click="open">开启投稿</el-button>
                <p v-if="status!=='close'">袜，投稿已经开启了！</p>
              </v-row>
            </v-tab-item>

            <!--开启审稿-->
            <v-tab-item>
              <v-row class="d-flex justify-center mt-8" v-if="status==='submission'||status==='submission_end'">
                <el-radio-group v-model="strategy">
                  <el-radio label="1">基于话题相关度</el-radio>
                  <el-radio label="2">基于审稿平均负担</el-radio>
                </el-radio-group>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status==='submission'||status==='submission_end'">
                <el-button class="recBtn-medium" type="primary" plain @click="openCheckPaper">开启初审</el-button>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status!=='close'&&status!=='submission'&&status!=='submission_end'">
                <p>初审已开启，分配结果：</p>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status==='viewing'||status==='view_end'">
                <el-table :data="distribution" style="width: 100%">
                  <el-table-column prop="username" label="用户名">
                    <template slot-scope="scope">
                      <span>{{scope.row.username}}{{scope.row.username==myname?"（我）":""}}&nbsp;&nbsp;&nbsp;</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="PC_name" label="姓名"></el-table-column>
                  <el-table-column prop="titles" label="分配到的稿件">
                    <template slot-scope="scope">
                      <span v-for="t in scope.row.papers" :key="t">{{t.title}}({{t.view==true?"已审核":"未审核"}},{{t.affirm==true?"已确认":"未确认"}})&nbsp;&nbsp;&nbsp;</span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status==='close'">
                <p>还是先开启投稿吧~</p>
              </v-row>
            </v-tab-item>

            <v-tab-item>
              <v-row class="d-flex flex-column justify-start align-center mt-8">
                <div class="my-2">
                  <el-button type="primary" plain @click="announceResult" v-if="status==='view_end'||status==='viewing'">发布初审结果</el-button>
                </div>
                <div class="text-center" v-if="status==='published_once'||status==='reviewing'||status==='review_end'||status==='published_final'||status==='begin'||status==='end'">初审结果已经发布</div>
              </v-row>
            </v-tab-item>


            <v-tab-item>
              <v-row class="d-flex justify-center mt-8" v-if="status==='reviewing'||status==='review_end'">
                <el-table :data="review_distribution" style="width: 100%">
                  <el-table-column prop="username" label="用户名">
                    <template slot-scope="scope">
                      <span>{{scope.row.username}}{{scope.row.username==myname?"（我）":""}}&nbsp;&nbsp;&nbsp;</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="PC_name" label="姓名"></el-table-column>
                  <el-table-column prop="titles" label="分配到的稿件">
                    <template slot-scope="scope">
                      <span v-for="t in scope.row.papers" :key="t">{{t.title}}({{t.affirm==true?"已确认":"未确认"}})&nbsp;&nbsp;&nbsp;</span>
                    </template>
                  </el-table-column>
                </el-table>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status==='published_final'||status==='begin'||status==='end'">
                <p>终审已关闭~</p>
              </v-row>

              <v-row class="d-flex justify-center mt-8" v-if="status!=='reviewing'&&status!=='review_end'&&status!=='published_final'&&status!=='begin'&&status!=='end'">
                <p>终审尚未开启~</p>
              </v-row>
            </v-tab-item>


            <v-tab-item>
              <v-row class="d-flex flex-column justify-start align-center mt-8">
                <div class="my-2">
                  <el-button type="primary" plain @click="announceFinalResult" v-if="status==='published_once'||status==='reviewing'||status==='review_end'">发布终审结果</el-button>
                  <div class="text-center" v-else-if="status==='published_final'||status==='begin'||status==='end'">终审结果已经发布</div>
                  <div class="text-center" v-else>终审尚未开启</div>
                </div>
              </v-row>
            </v-tab-item>

            <v-tab-item>
              <v-row justify="center">
                <v-expansion-panels popout>
                  <v-expansion-panel hide-actions>
                    <v-expansion-panel-header><!--简要条目陈列-->
                      <template v-slot:actions>
                        <v-icon>mdi-file-outline</v-icon>
                      </template>
                      <v-row align="center" class="spacer" no-gutters>
                        <v-col class="text-center" cols="2">
                          <span>作者</span>
                        </v-col>
                        <v-col class="text-center" cols="4">
                          <span>标题</span>
                        </v-col>
                        <v-col class="text-center" cols="2">
                          <span>话题</span>
                        </v-col>
                        <v-col class="text-center" cols="2">
                          <span>稿件状态</span>
                        </v-col>
                        <v-col class="text-center" cols="2">
                          <span>讨论区</span>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                  </v-expansion-panel>
                  <div id="cons"></div>

                  <v-expansion-panel hide-actions v-if="papers.length===0">
                    <v-expansion-panel-header>
                      <template v-slot:actions>
                        <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
                      </template>
                      <v-row align="center" class="spacer" no-gutters>
                        <v-col class="text-center" cols="12">
                          <strong>还没有人投稿过哦~</strong>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                  </v-expansion-panel>

                  <v-expansion-panel v-for="paper in papers" :key="paper" hide-actions>
                    <v-expansion-panel-header><!--简要条目陈列-->
                      <v-row align="center" class="spacer" no-gutters>
                        <!--作者-->
                        <v-col class="text-center" cols="2">
                          <strong :key="author" v-for="author in paper.authors">{{author}}&nbsp;&nbsp;</strong>
                        </v-col>

                        <!--标题-->
                        <v-col class="text-center textOverFlowHidden" cols="4">
                          <strong v-html="paper.title" :title="paper.title"></strong>
                        </v-col>

                        <!--话题-->
                        <v-col class="d-flex flex-row justify-start align-center flex-wrap" cols="2">
                          <el-tag style="margin: 3px;cursor: pointer;font-size: 8px" effect="light" type="success" :key="tag" v-for="tag in paper.topics">
                            {{tag}}
                          </el-tag>
                        </v-col>

                        <v-col class="text-center" cols="2">
                          <el-tag class="tag-default" type="info" effect="dark" v-if="paper.status==='unchecked'||paper.status==='waiting'">待初审</el-tag>
                          <el-tag class="tag-default" type="danger" effect="dark" v-if="paper.status==='waiting_once'">初审待讨论</el-tag>
                          <el-tag class="tag-default" type="warning" effect="dark" v-if="paper.status==='checked_once'">初审已确认</el-tag>
                          <el-tag class="tag-default" type="success" effect="dark" v-if="paper.status==='published_once'">初审结果已发布</el-tag>
                          <el-tag class="tag-default" type="danger" effect="dark" v-if="paper.status==='waiting_final'">复审待讨论</el-tag>
                          <el-tag class="tag-default" type="warning" effect="dark" v-if="paper.status==='checked_final'">复审已确认</el-tag>
                          <el-tag class="tag-default" type="success" effect="dark" v-if="paper.status==='published_final'">终审结果已发布</el-tag>
                        </v-col>

                        <v-col class="text-center" cols="2">
                          <el-button plain style="margin: 0" class="recBtn-medium" size="small" @click="discussPaper(paper.paper_id)" v-if="status==='viewing'||status==='reviewing'">进入</el-button>
                          <el-button plain style="margin: 0" class="recBtn-medium" size="small" disabled v-else>进入</el-button>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-row>

              <div class="DisplayRow-3">
                <el-pagination background @current-change="getPapers" :current-page.sync="currentPaperPage" :page-size="10" layout="prev, pager, next, jumper" :total.sync='paperRecord'></el-pagination>
              </div>
            </v-tab-item>

            <!--程序委员会-->
            <v-tab-item>
              <v-container class="displayConfDetail">
                <v-row justify="center">
                  <v-expansion-panels popout>
                    <v-expansion-panel hide-actions>
                      <v-expansion-panel-header><!--简要条目陈列-->
                        <template v-slot:actions>
                          <v-icon>mdi-card-account-details-outline</v-icon>
                        </template>
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center" cols="2">
                            <span>姓名</span>
                          </v-col>
                          <v-col class="text-center" cols="8">
                            <span>负责话题</span>
                          </v-col>
                          <v-col class="text-center" cols="2">
                            <span>邀请状态</span>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                    </v-expansion-panel>

                    <v-expansion-panel hide-actions v-if="users.length===0">
                      <v-expansion-panel-header>
                        <template v-slot:actions>
                          <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
                        </template>
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center" cols="12">
                            <strong>此会议还没有程序委员会委员，快去邀请吧~</strong>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                    </v-expansion-panel>

                    <v-expansion-panel v-for="user in users" :key="user" hide-actions><!--会议条目循环-->
                      <v-expansion-panel-header><!--简要条目陈列-->
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center textOverFlowHidden" cols="2">
                            <strong title="点击查看更多改委员信息" v-html="user.real_name"></strong>
                          </v-col>
                          <v-col class="text-center textOverFlowHidden" cols="8">
                            <el-tag v-if="user.hasOwnProperty('topics')" style="margin: 3px" type="success" :title="tag" :key="tag" v-for="tag in user.topics">
                              {{tag}}
                            </el-tag>
                            <p v-if="!user.hasOwnProperty('topics')">-</p>
                          </v-col>
                          <v-col class="text-center d-flex justify-center" cols="2">
                            <!--已同意-->
                            <el-tag v-if="user.status==='accept'" class="tag-default" type="success" effect="dark">已同意</el-tag>
                            <!--已拒绝-->
                            <el-tag v-if="user.status==='refuse'" class="tag-default" type="danger" effect="dark">已拒绝</el-tag>
                            <!--未处理-->
                            <el-tag v-if="user.status==='unprocessed'" class="tag-default" type="info" effect="dark">未处理</el-tag>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>

                      <v-expansion-panel-content><!--展开文本-->
                        <v-divider></v-divider><!--分割线-->
                        <v-card-text>
                          <v-row class="text-justify">
                            <v-col cols="6">用户名：{{user.username}}</v-col>
                            <v-col cols="6">邮箱：{{user.email}}</v-col>
                          </v-row>
                          <v-row class="text-justify">
                            <v-col cols="6">区域：{{user.region}}</v-col>
                            <v-col cols="6">单位：{{user.organization}}</v-col>
                          </v-row>
                        </v-card-text>
                      </v-expansion-panel-content>

                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-container>

              <div class="DisplayRow-3" id="pag">
                <el-pagination background @current-change="getInfo" :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total.sync='record'></el-pagination>
              </div>
            </v-tab-item>

            <!--邀请委员-->
            <v-tab-item>
              <v-row class="d-flex justify-center my-8" v-if="status==='close'||status==='submission'||status==='submission_end'">
                <el-input class="pcNameText" clearable placeholder="委员的真实姓名" prefix-icon="el-icon-search" v-model.lazy="pcName"></el-input>
                <el-button class="pcNameBtn" type="primary" @click="getUsers">搜索</el-button>
              </v-row>
              <v-container class="displayConfDetail" v-if="status==='close'||status==='submission'||status==='submission_end'">
                <v-row justify="center">
                  <v-expansion-panels popout>
                    <v-expansion-panel hide-actions>
                      <v-expansion-panel-header><!--简要条目陈列-->
                        <template v-slot:actions>
                          <v-icon>mdi-card-account-details-outline</v-icon>
                        </template>
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center" cols="1">
                            <span>姓名</span>
                          </v-col>
                          <v-col class="text-center" cols="4">
                            <span>邮箱</span>
                          </v-col>
                          <v-col class="text-center" cols="2">
                            <span>区域</span>
                          </v-col>
                          <v-col class="text-center" cols="2">
                            <span>单位</span>
                          </v-col>
                          <v-col class="text-center" cols="3">
                            <span>选择</span>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                    </v-expansion-panel>

                    <v-expansion-panel v-for="use in user" :key="use" hide-actions><!--会议条目循环-->
                      <v-expansion-panel-header><!--简要条目陈列-->
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center textOverFlowHidden" cols="1">
                            <strong v-html="lastSearch" :title="lastSearch"></strong>
                          </v-col>
                          <v-col class="text-center textOverFlowHidden" cols="4">
                            <strong v-html="use.email" :title="use.email"></strong>
                          </v-col>
                          <v-col class="text-center textOverFlowHidden" cols="2">
                            <strong v-html="use.region" :title="use.region"></strong>
                          </v-col>
                          <v-col class="text-center textOverFlowHidden" cols="2">
                            <strong v-html="use.organization" :title="use.organization"></strong>
                          </v-col>
                          <v-col class="text-center d-flex justify-center" cols="3">
                            <el-button type="primary" style="margin: 0; color: white" class="recBtn-medium" size="small" @click="invitePCMember(use.username)">邀请</el-button>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                    </v-expansion-panel>

                    <v-expansion-panel v-if="flag===false">
                      <v-expansion-panel-header>
                        <template v-slot:actions>
                          <v-icon color="warning">mdi-account-alert</v-icon>
                        </template>
                        <v-row align="center" class="spacer" no-gutters>
                          <v-col class="text-center" cols="12">
                            <strong>抱歉，未找到任何名为"{{lastSearch}}"的用户</strong>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </v-container>

              <v-row class="d-flex justify-center my-8" v-if="status!=='close'&&status!=='submission'&&status!=='submission_end'">
                <p>审稿已开启，不能再邀请委员了</p>
              </v-row>
            </v-tab-item>

            <!--审稿-->
            <v-tab-item>
              <v-row v-if="status!=='viewing'&&status!=='view_end'" class="d-flex justify-center mt-8">
                <p>抱歉，初审处于关闭状态</p>
              </v-row>

              <v-row v-if="status==='view_end'" class="d-flex justify-center mt-8">
                <p>初审结束，结果未发布</p>
              </v-row>

              <CheckPaper v-if="status==='viewing'" :conference_id="conference_id" :type="1" />
            </v-tab-item>

            <!--终审-->
            <v-tab-item>
              <v-row v-if="status!=='reviewing'&&status!=='review_end'" class="d-flex justify-center mt-8">
                <p>抱歉，终审处于关闭状态</p>
              </v-row>

              <v-row v-if="status==='review_end'" class="d-flex justify-center mt-8">
                <p>终审结束，结果未发布</p>
              </v-row>

              <CheckPaper v-if="status==='reviewing'" :conference_id="conference_id" :type="2"/>
            </v-tab-item>

          </v-tabs-items>
        </v-tabs>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'chair',
    data(){
      return{
        papers: [],
        record:-1,
        paperRecord:-1,
        currentPage:1,
        currentPaperPage:1,
        users:[],
        strategy: '1',
        choose: false,
        pcName: '',
        lastSearch:'',
        state:[],
        user:[],
        tab: null,
        status:'',
        conference_id:'',
        flag:true,
        distribution:[],
        review_distribution:[],
        myname:localStorage.getItem("username")
      };
    },
    mounted() {
      this.getStatus();
      this.getInfo();
      this.getDistribution();
      this.getReviewDistribution();
      this.getPapers();
    },
    methods:{
      // 发布终审结果
      announceFinalResult(){
        this.$confirm('确定发布终审审结果吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.get("/end_view?conference_id="+this.conference_id+"&mark=2")
            .then(resp => {
              this.$message({
                showClose: true,
                message: '已成功发布终审结果~',
                type: 'success'
              });
              this.status="published_final";
            })
            .catch(error => {
              this.$notify.info({
                title: '开启失败',
                message: '尚有评审人员未完成审稿，无法开启~'
              });
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消发布~',
            type: 'success'
          });
        });
      },

      // 跳转讨论页面
      discussPaper(id){
        this.$router.push({path: './DiscussPaper?paper_id='+id});
      },

      getDistribution(){
        //if(this.status==="viewing"||this.status==="view_end"){
          this.$axios.get("/distribution?conference_id="+this.conference_id+"&mark=1")
            .then(resp => {
              this.distribution=resp.data.pcmembers;
            })
            .catch(error => {
              console.log(error);
            });
        //}
      },

      getReviewDistribution(){
        this.$axios.get("/distribution?conference_id="+this.conference_id+"&mark=2")
          .then(resp => {
            this.review_distribution=resp.data.pcmembers;
          })
          .catch(error => {
            console.log(error);
          });
      },

      // 开启审稿
      openCheckPaper() {
        this.$confirm('确定开启审稿吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.get("/start_view?conference_id=" + this.conference_id + "&strategy=" + this.strategy)
            .then(resp => {
              this.$message({
                showClose: true,
                message: '已成功开启审稿~',
                type: 'success'
              });
              this.getDistribution();
              this.status = "viewing";
            })
            .catch(error => {
              if (error.data.message === "no one contributed") {
                this.$notify.info({
                  title: '开启失败',
                  message: '还没有人投稿，再等等吧~'
                });
              } else if (error.data.message === "no feasible solution") {
                this.$notify.info({
                  title: '开启失败',
                  message: '没有合适的审稿分配方案，建议再邀请若干审稿人~'
                });
              }
              else {
                this.$notify.info({
                  title: '开启失败',
                  message: '目前参与此会议的程序委员会委员数目少于2人，请再邀请新的程序委员会委员~'
                });
              }
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消开启~',
            type: 'success'
          });
        });
      },

      // 发布初审结果
      announceResult(){
        this.$confirm('确定发布初审结果吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.get("/end_view?conference_id="+this.conference_id+"&mark=1")
            .then(resp => {
              this.$message({
                showClose: true,
                message: '已成功发布初审结果~',
                type: 'success'
              });
              this.status="published_once";
            })
            .catch(error => {
                this.$notify.info({
                  title: '开启失败',
                  message: '尚有评审人员未完成审稿，无法开启~'
                });
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消发布~',
            type: 'success'
          });
        });
      },

      getQueryVariable(variable)
      {
        var query = window.location.href;
        var search='';
        for (var i=0;i<query.length;i++) {
          if (query.charAt(i) === '?') {
            search = query.substring(i+1);
            break;
          }
        }
        console.log(search);
        var vars = search.split("&");
        for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if(pair[0] == variable){return pair[1];}
        }
        return(false);
      },
      getStatus(){
        this.conference_id=this.getQueryVariable("conference_id");
        this.$axios.get('/conference_detail?conference_id='+this.conference_id)
          .then(resp => {
            this.status=resp.data.conference_stage;
          })
          .catch(error => {
            console.log(error);
          });
      },
      getInfo(){
        this.$axios.get('/invite_status?conference_id='+this.conference_id+'&page='+this.currentPage)
          .then(resp => {
            this.record=resp.data.record;
            this.users=resp.data.conferences;
            for (var i=0;i<this.users.length;i++){
              if (this.users[i].hasOwnProperty("topics"))
                this.users[i].topics=JSON.parse(this.users[i].topics)
            }
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

      getPapers(){
        this.$axios.get('/all_papers?conference_id='+this.conference_id+'&page='+this.currentPaperPage)
          .then(resp => {
            this.paperRecord=resp.data.record;
            this.papers=resp.data.papers;
            for (var i=0;i<this.papers.length;i++){
              if (this.papers[i].hasOwnProperty("topics"))
                this.papers[i].topics=JSON.parse(this.papers[i].topics)
            }
          })
          .catch(error => {
            this.currentPaperPage = 1;
            console.log(error);
          });
      },

      getUsers() {
        this.$axios.get('/find_user?realname='+this.pcName)
          .then(resp => {
            this.lastSearch=this.pcName;
            this.state.length=resp.data.user.length;
            this.user=resp.data.user;
            this.flag=true;
          })
          .catch(error => {
            this.lastSearch = this.pcName;
            this.flag = false;
            this.user = [];
            console.log(error);
          });
      },

      //邀请该用户成为审稿人
      invitePCMember(username){
        this.$confirm('确定邀请吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.post('/invite_pc', {
            conference_id: this.conference_id,
            username: username
          })
            .then(resp => {
              this.$message({
                showClose: true,
                message: '邀请成功',
                type: 'success'
              });
              this.getInfo();
            })
            .catch(error => {
              this.$notify.error({
                title: '邀请失败',
                message: '可能是因为你已经邀请过你刚刚选中的人，重新选择吧！'
              });
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消邀请~',
            type: 'success'
          });
        });

      },

      //开启投稿
      open(){
        this.$confirm('确定开启投稿吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.get("/start_submission?conference_id="+this.conference_id)
            .then(resp => {
              this.$message({
                showClose: true,
                message: '已成功开启投稿~',
                type: 'success'
              });
              this.status="submission";
            })
            .catch(error => {
              this.$notify.error({
                title: '开启失败',
                message: '您可以再次尝试'
              });
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消开启~',
            type: 'success'
          });
        });
      },
    },
  }
</script>

