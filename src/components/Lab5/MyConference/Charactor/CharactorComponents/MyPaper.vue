<style lang="css" scoped></style>
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
                <span>审核状态</span>
              </v-col>
              <v-col class="text-center" cols="2">
                <span>处理</span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>
        <div id="cons"></div>

        <!--没有稿件显示这个,把你原先搞的那行绿字取消了_jxw-->
        <v-expansion-panel hide-actions v-if="papers.length===0">
          <v-expansion-panel-header>
            <template v-slot:actions>
              <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
            </template>
            <v-row align="center" class="spacer" no-gutters>
              <v-col class="text-center" cols="12">
                <strong>没有稿件，快去投稿吧~</strong>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>

        <!--有稿件显示这个_jxw-->
        <v-expansion-panel v-for="paper in papers" :key="paper" hide-actions>
          <v-expansion-panel-header><!--简要条目陈列-->
            <v-row align="center" class="spacer" no-gutters>
              <!--作者-->
              <v-col class="text-center" cols="2">
                <strong :key="author" v-for="author in JSON.parse(paper.authors)">{{author.realname}}&nbsp;&nbsp;</strong>
              </v-col>

              <!--标题-->
              <v-col class="text-center textOverFlowHidden" cols="4">
                <strong v-html="paper.title" :title="paper.title"></strong>
              </v-col>

              <!--话题-->
              <v-col class="d-flex flex-row justify-start align-center flex-wrap" cols="2">
                <el-tag style="margin: 3px;cursor: pointer;font-size: 8px" effect="light" type="success" :key="tag" v-for="tag in JSON.parse(paper.topics)">
                  {{tag}}
                </el-tag>
              </v-col>

              <!--审核状态，修改_jxw-->
              <v-col class="text-center" cols="2">
                <!--改-->
                <el-tag class="tag-default" type="info" effect="dark" v-if="paper.status==='unchecked'||paper.status==='waiting'" key="">待初审</el-tag>
                <el-tag class="tag-default" type="info" effect="dark" v-if="paper.status==='waiting_once'||paper.status==='checked_once'" key="">初审中</el-tag>
                <el-tag class="tag-default" type="primary" effect="dark" v-if="paper.status==='published_once'" key="">初审已发布</el-tag>
                <el-tag class="tag-default" type="primary" effect="dark" v-if="paper.status==='published_once'&&paper.pass==='success'" key="">已录用</el-tag>
                <el-tag class="tag-default" type="primary" effect="dark" v-if="paper.status==='waiting_final'||paper.status==='checked_final'" key="">复审中</el-tag>
                <el-tag class="tag-default" type="info" effect="dark" v-if="paper.status==='published_final'" key="">终审已发布</el-tag>
                <el-tag class="tag-default" type="primary" effect="dark" v-if="paper.status==='published_final'&&paper.pass==='success'" key="">已录用</el-tag>


                <!--原-->
                <!--待审核-->
<!--                <el-tag v-if="paper.status==='unchecked'||paper.status==='waiting'" class="tag-default" type="info" effect="dark" key="">待审核</el-tag>-->
<!--                &lt;!&ndash;已审稿,未发布&ndash;&gt;-->
<!--                <el-tag v-if="paper.status==='checked'" class="tag-default" type="danger" effect="dark" key="">待审核</el-tag>-->
<!--                &lt;!&ndash;已审稿,已发布&ndash;&gt;-->
<!--                <el-tag v-if="paper.status==='published'" class="tag-default" type="success" effect="dark" key="">已发布</el-tag>-->
              </v-col>
              <!--处理-->
              <v-col class="text-center" cols="2">
                <!--待审核，修改-->
                <el-button v-if="paper.status==='unchecked'" plain style="margin: 0; color: white" class="recBtn-medium" size="small" @click="modify(paper.paper_id)">修改</el-button>
                <!--已审稿,已发布，查看结果-->
                <el-button v-else-if="paper.status==='published_once'" plain style="margin: 0" class="recBtn-medium" size="small" @click="view(paper.paper_id)">查看初审结果</el-button>
                <el-button v-else-if="paper.status==='published_final'" plain style="margin: 0" class="recBtn-medium" size="small" @click="view(paper.paper_id)">查看终审结果</el-button>
                <el-button v-else-if="paper.status!=='published_once'||paper.pass!=='fail'" plain style="margin: 0" class="recBtn-medium" size="small" disabled>无可用操作</el-button>
                <el-button v-if="paper.status==='published_once'&&paper.pass==='fail'" plain style="margin: 0" class="recBtn-medium" size="small" @click="doRebuttal(paper.paper_id)">发起驳回申请</el-button>


              </v-col>
            </v-row>
          </v-expansion-panel-header>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <el-dialog width="50%" title="评审结果" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="score" label="分数" width="150"></el-table-column>
        <el-table-column property="comment" label="评价" width="200"></el-table-column>
        <el-table-column property="confidence" label="confidence"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog width="50%" title="驳回申请" :visible.sync="rebuttalFlag">
      <!--驳回申请输入框-->
      <el-input class="mt-5" type="textarea" :rows="3" placeholder="请输入驳回申请" v-model="rebuttalText"></el-input>
      <div class="d-flex flex-row justify-end">
        <el-button size="small" style="color: white" @click="submitRebuttal" class="mt-4" type="primary">提交</el-button>
        <el-button size="small" style="color: white" class="mt-4" type="danger" @click="rebuttalFlag = false">取消</el-button>
      </div>

    </el-dialog>
  </v-container>
</template>

<script>
    export default {
        name: "myPaper",
      props: {
        conference_id: {
          required: true
        }
      },
      data(){
        return{
          rebuttalFlag: false,// 驳回申请输入框和提交驳回申请的按钮是否出现的旗
          rebuttalText: '',// 驳回申请输入框的内容
          rebuttalId:-1,
          gridData:[],
          dialogTableVisible:false,
          number:-1,
          record:-1,
          currentPage:1,
          papers:[]
        };
      },
      mounted() {
        this.getInfo()
      },
      methods:{
        doRebuttal(paper_id) {
          this.rebuttalFlag=true;
          this.rebuttalId=paper_id;
        },

        // 需要实现提交驳回申请_jxw
        submitRebuttal(){
          this.$axios.get("/rebuttal?paper_id="+this.rebuttalId+"&&content="+this.rebuttalText)
            .then(resp => {
              this.$message({
                showClose: true,
                message: '申请成功，请耐心等待复审',
                type: 'success'
              });
              this.rebuttalFlag = false;
            })
            .catch(error => {
              console.log(error);
            });
        },


        modify(paper_id){
          this.$router.push({path: './Paper?paper_id='+paper_id+"&conference_id="+this.getQueryVariable("conference_id")});
        },

        view(paper_id){
          this.$axios.get('/paper_result?paper_id='+paper_id)
            .then(resp => {
              this.dialogTableVisible=true;
              this.gridData=resp.data.result;
            })
            .catch(error => {
              console.log(error);
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


        getInfo() {
          this.$axios.get('/my_paper?conference_id='+this.getQueryVariable("conference_id"))
            .then(resp => {
              this.papers=resp.data.papers;
            })
            .catch(error => {
              console.log(error);
            });
        },
      }
    }
</script>

<style scoped>

</style>
