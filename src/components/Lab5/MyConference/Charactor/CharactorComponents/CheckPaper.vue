<style src="" lang="css" scoped></style>
<template>
  <v-container class="displayConfDetail">
    <v-row justify="center">
      <v-expansion-panels popout>
        <v-expansion-panel hide-actions>
          <v-expansion-panel-header><!--简要条目陈列-->
            <template v-slot:actions>
              <v-icon>mdi-file-outline</v-icon>
            </template>
            <v-row align="center" class="spacer" no-gutters>
              <v-col class="text-center" cols="3">
                <span>标题</span>
              </v-col>
              <v-col class="text-center" cols="3">
                <span>话题</span>
              </v-col>
              <v-col class="text-center" cols="2">
                <span>稿件状态</span>
              </v-col>
              <v-col class="text-center" cols="2">
                <span>审稿</span>
              </v-col>
              <v-col class="text-center" cols="2">
                <span>讨论区</span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>

        <v-expansion-panel hide-actions v-if="papers.length===0">
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
            </template>
            <v-row align="center" class="spacer" no-gutters>
              <v-col class="text-center" cols="12">
                <strong>暂时没有稿件~</strong>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>

        <v-expansion-panel v-for="paper in papers" :key="paper" hide-actions>
          <v-expansion-panel-header><!--简要条目陈列-->
            <v-row align="center" class="spacer" no-gutters>
              <!--标题-->
              <v-col class="text-center textOverFlowHidden" cols="3">
                <strong v-html="paper.title" :title="paper.title"></strong>
              </v-col>

              <!--话题-->
              <v-col class="d-flex flex-row justify-start align-center flex-wrap" cols="3">
                <el-tag style="margin: 3px;cursor: pointer;font-size: 8px" effect="light" type="success" :key="tag" v-for="tag in paper.topics">
                  {{tag}}
                </el-tag>
              </v-col>

              <!--审核状态-->
              <v-col class="text-center" cols="2">
                <el-tag class="tag-default" type="primary" v-if="paper.view==false&&(paper.status==='waiting'||paper.status==='waiting_once')" effect="dark">待初审</el-tag>

                <el-tag class="tag-default" type="danger" v-if="paper.view==true&&paper.affirm==false&&(paper.status==='waiting'||paper.status==='waiting_once')" effect="dark">初审待讨论</el-tag>

                <el-tag class="tag-default" type="warning" v-if="paper.affirm==true&&(paper.status==='waiting'||paper.status==='waiting_once'||paper.status==='checked_once')" effect="dark">初审已确认</el-tag>

                <el-tag class="tag-default" type="primary" v-if="paper.view==false&&paper.status==='published_once'" effect="dark">待复审</el-tag>

                <el-tag class="tag-default" type="danger" v-if="paper.view==true&&paper.affirm==false&&(paper.status==='published_once'||paper.status==='waiting_final')" effect="dark">复审待讨论</el-tag>

                <el-tag class="tag-default" type="warning" v-if="paper.affirm==true&&(paper.status==='published_once'||paper.status==='waiting_final'||paper.status==='checked_final')" effect="dark">复审已确认</el-tag>

              </v-col>

              <!--处理,修改_jxw-->
              <v-col class="text-center" cols="2">
                <el-button v-if="paper.affirm==false" plain style="margin: 0" class="recBtn-medium" size="small" @click="checkPaper(paper.paper_id,paper.view)">审稿</el-button>

                <el-button v-else plain style="margin: 0" class="recBtn-medium" size="small" disabled>已确认</el-button>
              </v-col>

              <!--讨论区_jxw-->
              <v-col class="text-center" cols="2">
                <el-button plain style="margin: 0" class="recBtn-medium" size="small" @click="discussPaper(paper.paper_id)">进入讨论区</el-button>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <div class="DisplayRow-3">
      <el-pagination background @current-change="getInfo" :current-page.sync="currentPage" :page-size="10" layout="prev, pager, next, jumper" :total.sync='record'></el-pagination>
    </div>
  </v-container>
</template>
<script>
  export default {
    name: 'checkPaper',
    props: {
      conference_id: {
        required: true
      },
      type: {
        required: true
      },
    },
    data(){
      return{
        number:-1,
        record:-1,
        currentPage:1,
        papers:[]
      };
    },
    mounted() {
      // 页码相关
      this.getInfo()
    },
    methods:{
      getInfo() {
        if (this.type == "1") {
          this.$axios.get('/view_papers?conference_id=' + this.conference_id+"&mark=1")
            .then(resp => {
              this.papers = resp.data.papers;
              console.log(this.papers);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          this.$axios.get('/view_papers?conference_id=' + this.conference_id+"&mark=2")
            .then(resp => {
              this.papers = resp.data.papers;
              console.log(this.papers);
            })
            .catch(error => {
              console.log(error);
            });
        }
      },

      // --------------------跳转--------------------
      // 跳转审稿页面
      checkPaper(paper_id,view){
        this.$router.push({path: './ScorePaper?paper_id='+paper_id+"&view="+view+"&mark="+this.type});
      },

      // 跳转讨论页面_jxw
      discussPaper(paper_id){
        this.$router.push({path: './DiscussPaper?paper_id='+paper_id});
      }
    },
  }
</script>

