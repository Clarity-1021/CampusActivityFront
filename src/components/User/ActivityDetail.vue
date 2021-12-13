<style src="" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--报名信息填写-->
    <v-form lazy-validation ref="repayForm" v-model="repayValid">
      <v-dialog transition="dialog-bottom-transition" v-model="dialogRepay" max-width="700px">
        <v-card>
          <v-toolbar class="headline d-flex flex-row justify-center" color="green darken-3" dark><div>报名信息</div></v-toolbar>

          <v-row class="pt-5" style="margin: 0">
            <v-col cols="12" xs="6" sm="6" md="6" lg="6" class="px-5 d-flex flex-row">
              <v-text-field :rules="SignUpFormRules.name" color="green darken-3" dense outlined clearable label="姓名" v-model="SignUpForm.name"></v-text-field>
            </v-col>
            <v-col cols="12" xs="6" sm="6" md="6" lg="6" class="px-5 d-flex flex-row">
              <v-text-field :rules="SignUpFormRules.number" color="green darken-3" dense outlined clearable label="手机号" v-model="SignUpForm.number"></v-text-field>
            </v-col>
          </v-row>


          <v-card-actions>
            <v-btn color="green darken-3" text @click="clearRepayForm">清空</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="green darken-3" text @click="dialogRepay = false">取消</v-btn>
            <v-btn text :loading="progressSignUp" :disabled="!repayValid" color="green darken-3" @click="repayHandler">提交</v-btn>
          </v-card-actions>

        </v-card>
      </v-dialog>
    </v-form>

    <!--菜单-->
    <LeftMenu />
    <TopToolBar />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <div class="DisplayRow-1">
          <v-btn class="mr-4" outlined small fab color="teal lighten-1" @click="goBack">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div style="width: 120px; height: 100%" class="d-flex flex-column justify-center align-center">
            <div style="font-size: 18px">活动详情</div>
            <div style="border: solid 2px; width: 90px; border-radius: 10px; border-color: rgba(26, 188, 156, 0.45)"></div>
          </div>
        </div>

        <!--        <v-row style="width: 100%;border: solid" justify="center">-->
        <v-img width="95%"
               src="../../../static/images/ActivityPics/PlayCards.jpg"
               max-width="500"
               max-height="300"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <!--        </v-row>-->

        <v-row class="mt-12" style="width: 100%">
          <!--          <v-card-->
          <!--            style="width: 100%"-->
          <!--            class="mx-auto"-->
          <!--            tile-->
          <!--          >-->

          <v-list-item v-for="listItem in listItems" :key="listItem" two-line>
            <v-list-item-content>
              <v-list-item-title>{{listItem.name}}</v-list-item-title>
              <v-list-item-subtitle>{{item[listItem.val]}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item key="listItem" two-line>
            <v-list-item-content>
              <v-list-item-title>活动时间</v-list-item-title>
              <v-list-item-subtitle>{{item.StartTime}} - {{item.EndTime}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item key="listItem" two-line>
            <v-list-item-content>
              <v-list-item-title>报名时间</v-list-item-title>
              <v-list-item-subtitle>{{item.SignUpStartTime}} - {{item.SignUpEndTime}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!--          </v-card>-->
        </v-row>

        <v-row class="d-flex justify-center mt-12" style="width: 100%">
          <v-btn @click="OnSignUp" dark color="green darken-3">报名</v-btn>
        </v-row>

        <v-container>
          <span v-if="items.length===0" class="text--disabled">无讨论</span>

          <div :key="item" v-for="item in items" v-else>
            <div class="d-flex flex-column justify-start align-start ml-2" style="width: 100%">
              <!--用户姓名和提交时间-->
              <div class="d-flex flex-row justify-start align-center">
                <span style="font-weight: 600" class="d-block pr-2 text--primary body-1" v-html="item.username"></span>
                <span class="d-block text--disabled subtitle-2">{{item.update_time}}</span>
              </div>

              <!--帖子-->
              <div class="text-left body-1" style="text-indent: 2em">{{ item.content }}</div>

              <!--展开回帖按钮和回帖按钮-->
              <div class="d-flex flex-row justify-space-between align-center" style="width: 100%">
                <div class="d-flex flex-row justify-start align-center">
                  <!--展开回帖的按钮-->
                  <v-btn color="grey lighten-1" disabled icon sizes="small" v-if="item.comment.length!==0" @click="item.displayRepliesFlag = !item.displayRepliesFlag">
                    <v-icon size="large">mdi-message</v-icon>
                  </v-btn>
                  <!--回帖的个数-->
                  <span class="d-block text--disabled body-2" v-if="item.comment.length!==0">{{ item.comment.length }}</span>
                </div>

                <div style="font-size: 14px; color: rgb(26,188,156); cursor: pointer" class="px-2" @click="sendReply(item)">回帖</div>
              </div>

              <div :key="reply" v-for="(reply) in item.comment" v-if="item.displayRepliesFlag" class="pl-6" style="width: 100%; border-left: solid 4px; border-color: rgba(26, 188, 156, 0.45)">
                <v-divider class="mb-3"></v-divider>
                <div class="d-flex flex-column justify-start align-start ml-2" style="width: 100%">
                  <!--回帖用户真实姓名和回帖时间-->
                  <div class="d-flex flex-row justify-start align-center">
                    <span style="font-weight: 600" class="d-block pr-2 text--primary body-1">{{ reply.username }}</span>
                    <span v-if="reply.type==1" class="d-block text--disabled subtitle-2">回复</span>
                    <span style="font-weight: 600" v-if="reply.type==1" class="d-block px-2 text--primary body-1">{{reply.target_username==undefined?"":reply.target_username}}</span>
                    <span class="d-block text--disabled body-2" v-if="item.comment.length!==0">{{ reply.update_time }}</span>
                  </div>

                  <!--回帖内容-->
                  <div class="text-left body-1" style="text-indent: 2em">{{ reply.content }}</div>

                  <div class="d-flex flex-row justify-end align-center" style="width: 100%">
                    <div style="margin-right: 0.5em; font-size: 14px; color: rgb(26,188,156); cursor: pointer" class="px-2" @click="sendReplyReply(item,reply)">回帖</div>
                  </div>
                </div>
              </div>
            </div>

            <v-row>
              <v-divider class="mb-4 mt-3" v-if="item.displayRepliesFlag"></v-divider>
              <v-divider class="mb-4" v-else></v-divider>
            </v-row>
          </div>

          <div class="DisplayRow-3" v-if="this.items.length!==0">
            <el-pagination background @current-change="getDiscussion" :current-page.sync="currentPage" :page-size="4" layout="prev, pager, next, jumper" :total.sync='record'></el-pagination>
          </div>

          <!--创建帖子输入框和提交创建按钮-->
          <el-input class="mt-2" type="textarea" :rows="3" placeholder="请输入" v-model="myComment"></el-input>
          <div class="d-flex flex-row justify-end my-3" style="width: 100%">
            <el-button size="small" @click="submitMyComment" plain>创建帖子</el-button>
          </div>


          <el-dialog title="回复" :visible.sync="replyDialogFlag">
            <el-input class="mt-2" type="textarea" :rows="3" placeholder="请输入" v-model="myReply"></el-input>
            <el-row class="mt-4 d-flex justify-end">
              <el-button type="primary" size="small" style="color: white" v-if="this.type===0" @click="submitMyReply">发送评论</el-button>
              <el-button type="primary" size="small" style="color: white" v-if="this.type===1" @click="submitMyReplyReply">发送回复</el-button>
              <el-button size="small" @click="replyDialogFlag = false">取消</el-button>
            </el-row>
          </el-dialog>


        </v-container>
      </div>
    </div>


  </div>
</template>
<script>
export default {
  name: 'ActivityDetail',
  data(){
    return{
      type:0,
      currentItem:null,
      currentReply:null,
      replyDialogFlag:false,
      record:-1,
      currentPage:1,
      paper_id:this.getQueryVariable("paper_id"),
      rebuttalText: "dfjkjalkjkdlsajkfjal",
      gridData:[],
      myReply:'',
      myComment: '',// 创建新帖子的输入框中的内容
      progressSignUp: false,
      // 帖子的数组，测试用
      items: [],
      item:
        {
          FullName: '活动名称七个字',
          Abstract: 'Abstract',
          Hoster: '主办方六个字',
          Place: '地点五个字',
          StartTime: '开始日期七个字',
          EndTime: '结束日期七个字',
          SignUpStartTime: '结束日期七个字',
          SignUpEndTime: '结束日期七个字',
          State: '状态'
        },
      listItems:
        [
          {
            name: '活动名称',
            val: 'FullName',
          },
          {
            name: '活动简介',
            val: 'Abstract',
          },
          {
            name: '主办方',
            val: 'Hoster',
          },
          {
            name: '活动地点',
            val: 'Place',
          },
          {
            name: '活动状态',
            val: 'State',
          },
        ],
      repayValid: false,
      repayForm: {
        kkfs: '',
        jydm: '',
      },
      SignUpForm:
        {
          name: '',
          number: '',
        },
      SignUpFormRules: {
        name: [v => !!v || '请输入姓名'],
        number: [v => !!v || '请输入电话号码'],
      },
      dialogRepay: false,
    };
  },
  mounted() {
    this.getDiscussion();
  },
  methods:{
    clearRepayForm () {
      this.$refs.repayForm.reset();
    },

    repayHandler () {
      if (this.$refs.repayForm.validate()) {
        this.progressSignUp = true;
        setTimeout(() => (this.progressSignUp = false), 2000)

        this.$notify({
          title: '报名提交失败，请重试',
          type: 'error'
        });

        this.$message({
          showClose: true,
          message: '报名成功',
          type: 'success'
        });
      }
    },

    // Todo
    OnSignUp ()
    {
      this.dialogRepay = true;
    },

    sendReplyReply(item,reply){
      this.replyDialogFlag=true;
      this.currentItem=item;
      this.currentReply=reply;
      this.type=1;
    },

    sendReply(item){
      this.replyDialogFlag=true;
      this.currentItem=item;
      this.type=0;
    },

    getDiscussion(){
      this.$axios.get('/get_discussion?paper_id='+this.paper_id+"&page="+this.currentPage)
        .then(resp => {
          this.items=resp.data.comment;
          this.record=resp.data.record;
          for (var i=0;i<this.items.length;i++){
            if (!this.items[i].comment){
              this.items[i].comment=[];
            }
            this.items[i].id=i;
            this.items[i].displayRepliesFlag=true;
          }
        })
        .catch(error => {
          this.record=error.data.record;
          this.currentPage=1;
          console.log(error);
        });
    },

    submitMyReply(){
      this.$confirm('确定发送吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.post('/discuss', {
          paper_id: this.paper_id,
          floor: this.currentItem.floor,
          username : localStorage.getItem("username"),
          content: this.myReply,
          type: 0,
          target_num:this.currentItem.floor,
          target_username:this.currentItem.username
        })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '发送成功',
              type: 'success'
            });
            this.getDiscussion();
            this.replyDialogFlag=false;
          })
          .catch(error => {
            this.$notify.error({
              title: '发送失败',
              message: '重新发送试试吧！'
            });
            console.log(error);
          })
      }).catch(() => {
        //取消注销消息提示
        this.$message({
          showClose: true,
          message: '已取消发送~',
          type: 'success'
        });
      });

    },

    submitMyComment(){
      this.$confirm('确定发帖吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.post('/new_discussion', {
          paper_id: this.paper_id,
          username : localStorage.getItem("username"),
          content: this.myComment
        })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '发帖成功',
              type: 'success'
            });
            this.getDiscussion();
          })
          .catch(error => {
            this.$notify.error({
              title: '创建失败',
              message: '重新创建试试吧！'
            });
            console.log(error);
          })
      }).catch(() => {
        //取消注销消息提示
        this.$message({
          showClose: true,
          message: '已取消创建~',
          type: 'success'
        });
      });
    },

    submitMyReplyReply(){
      this.$confirm('确定回复吗？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$axios.post('/discuss', {
          paper_id: this.paper_id,
          floor: this.currentItem.floor,
          username : localStorage.getItem("username"),
          content: this.myReply,
          type: 1,
          target_num:this.currentReply.num,
          target_username:this.currentReply.username
        })
          .then(resp => {
            this.$message({
              showClose: true,
              message: '回复成功',
              type: 'success'
            });
            this.getDiscussion();
            this.replyDialogFlag=false;
          })
          .catch(error => {
            this.$notify.error({
              title: '回复失败',
              message: '重新发送试试吧！'
            });
            console.log(error);
          })
      }).catch(() => {
        //取消注销消息提示
        this.$message({
          showClose: true,
          message: '已取消回复~',
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

    // 返回上一个页面
    goBack(){
      this.$router.go(-1);
    },
  },
}
</script>

