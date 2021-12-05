<style src="../../../static/mycss/Lab3/LeftMenu.css" lang="css" scoped></style>
<template>
  <div class="left-container d-none d-md-block">
    <!--菜单栏第1行外框-->
    <div class="MenuRow-1">
      <div class="MsgCenterBox"><!--消息中心外框-->
        <div class="MsgBtnBox" @click="goToMessage">
          <div class="spot-btn messageBtn"><i class="fa fa-bell-o"></i></div>
          <el-badge :value="this.record" :max="10" class="badgeStyle" v-if="this.record !== 0"></el-badge>
        </div>
      </div>
      <div class="MenuFirstRow-right">
        <el-dropdown @command="handleCommand" :hide-on-click="false">
          <div class="AvatarBox"><!--头像外框-->
            <el-avatar :src="url" :size="66" class="avatar" v-if="myname !== 'admin'">{{myname}}</el-avatar>
            <el-avatar :src="adminUrl" :size="66" class="avatar" v-else>{{myname}}</el-avatar>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">查看大图</el-dropdown-item>
            <el-dropdown-item command="c">我的信息</el-dropdown-item>
            <el-dropdown-item command="d">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--菜单栏第2行外框-->
    <div class="MenuRow-2">
      <div class="MenuBox"><!--菜单外框-->
        <div class="menuItem" @click="goToMyConference">我的活动</div>
        <div class="menuItem" @click="goToAllConference">所有活动</div>
<!--        <div class="menuItem" @click="alertNo">~其他功能~</div>-->
<!--        <div class="menuItem" @click="alertNo">~暂未开发~</div>-->
        <div class="menuItem" @click="goToHome">主页</div>
        <div class="menuAnimation" v-if="currentMenuItem === ''"></div>
        <div class="menuAnimation start-1" v-if="currentMenuItem === 'MyConference'"></div>
        <div class="menuAnimation start-2" v-if="currentMenuItem === 'AllConference'"></div>
        <div class="menuAnimation start-3" v-if="currentMenuItem === 'Home'"></div>
<!--        <div class="menuAnimation start-4" v-if="currentMenuItem === ''"></div>-->
<!--        <div class="menuAnimation start-5" v-if="currentMenuItem === ''"></div>-->
      </div>
    </div>
    <!--菜单栏第3行外框-->
    <div class="MenuRow-3">
      <div class="NewConferenceBox">
        <div class="NewBtnBox">
          <div class="square-btn" @click="goToNewConference"><i class="fa fa-plus-square-o"></i></div>
        </div>
      </div>
    </div>
    <!--菜单栏第4行外框-->
<!--    <div class="MenuRow-4">-->
<!--      <div class="wave-btn" @click="goToAllConference">-->
<!--        <span>所有会议</span>-->
<!--        <div class="waveBtnEffect"></div>-->
<!--      </div>-->
<!--    </div>-->

    <!--<el-dialog title="上传头像" :visible.sync="dialogFormVisible">-->
      <!--<el-upload-->
        <!--action="#"-->
        <!--ref="upload"-->
        <!--accept="image/*"-->
        <!--:auto-upload="false"-->
        <!--:limit="1"-->
        <!--list-type="picture-card"-->
        <!--:http-request="uploadSubmit"-->
        <!--:on-preview="handlePictureCardPreview"-->
        <!--:on-exceed="handleExceed"-->
        <!--:on-remove="handleRemove">-->
        <!--<i class="el-icon-plus"></i>-->
      <!--</el-upload>-->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="url" :alt="myname + '的头像'" v-if="myname !== 'admin'">
        <img width="100%" :src="adminUrl" alt="管理员的头像" v-else>
      </el-dialog>

    <!--在这些空span里面填一下对应的数据_jxw-->
    <el-dialog :visible.sync="dialogVisible2">
      <v-row class="text-center subtitle-1 my-1 mx-4">
        <span class="text--disabled">用户名：</span>
        <span>{{myname}}</span>
      </v-row>
      <v-row class="text-center subtitle-1 my-1 mx-4">
        <span class="text--disabled">真实姓名：</span>
        <span>{{realname}}</span>
      </v-row>
      <v-row class="text-center subtitle-1 my-1 mx-4">
        <span class="text--disabled">邮箱：</span>
        <span>{{email}}</span>
      </v-row>
      <v-row class="text-center subtitle-1 my-1 mx-4">
        <span class="text--disabled">学校：</span>
        <span>{{region}}</span>
      </v-row>
      <v-row class="text-center subtitle-1 my-1 mx-4">
        <span class="text--disabled">组织：</span>
        <span>{{organization}}</span>
      </v-row>
    </el-dialog>

      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="dialogFormVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="submitUpload()">上 传</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->
  </div>
</template>


<script>
  export default {
    name: 'leftMenu',
    data(){
      return{
        record:0,
        // dialogImageUrl:"../../../static/images/默认头像.jpg",
        // adminUrldialogImageUrl:"../../../static/images/管理员头像.PNG",
        dialogVisible: false,
        dialogVisible2: false,
        realname:'',
        organization:'',
        region:'',
        email:"",
        // disabled: false
        myname:localStorage.getItem("username"),
        url:"../../../static/images/默认头像.jpg",
        adminUrl:"../../../static/images/管理员头像.PNG",
      };
    },
    props:{
      currentMenuItem:{
        type: String,
        default: '',
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        this.$axios.get('/message_number')
          .then(resp => {
            this.record = resp.data.number;
          })
          .catch(error => {
              console.log(error);
          });

        this.$axios.get('/my_information')
          .then(resp => {
            this.realname=resp.data.realname;
            this.organization=resp.data.organization;
            this.region=resp.data.region;
            this.email=resp.data.email;
          })
          .catch(error => {
            console.log(error);
          });
      },

      //跳转消息中心
      goToMessage() {
        if (this.$store.state.role==="admin"){
          this.$notify.error({
            title: '错误',
            message: '管理员没有此权限'
          });
        } else {
          if(this.currentMenuItem === 'Message'){
            this.refresh();
          }
          else{
            this.$router.push({path: './Message'});
          }
        }
      },

      // 注销弹窗，确认取消
      logoutCheck() {
        this.$confirm('确定要注销吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$store.commit("logout");

          //注销成功通知
          this.$notify({
            title: '注销成功！',
            type: 'success'
          });
          //跳转登录
          this.$router.push({path: './login'});
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消注销~',
            type: 'success'
          });
        });
      },

      handleCommand(command) {
        if (command==="d"){
          this.logoutCheck();
        }else if(command==="b"){
          this.$notify.info({
            title: '消息',
            message: '抱歉，此功能暂未开发',
            position: 'top-right'
          });
        }else if (command==="a") {
          this.dialogVisible=true;
        }else {
          this.dialogVisible2=true;
        }
      },

      //跳转我的会议
      goToMyConference() {
        if (this.$store.state.role==="admin"){
          this.$notify.error({
            title: '错误',
            message: '管理员没有此权限'
          });
        } else {
          if(this.currentMenuItem === 'MyConference'){
            this.refresh();
          }
          else{
            this.$router.push({path: './MyConference'});
          }
        }
      },

      //功能未开发通知
      alertNo() {
        this.$notify.info({
          title: '消息',
          message: '抱歉，此功能暂未开发',
          position: 'top-right'
        });
      },

      //跳转主页
      goToHome() {
        if (this.$store.state.role==="admin"){
          this.$notify.error({
            title: '错误',
            message: '管理员没有此权限'
          });
        } else {
          if(this.currentMenuItem === 'Home'){
            this.refresh();
          }
          else{
            this.$router.push({path: './'});
          }
        }
      },

      //跳转创建会议
      goToNewConference() {
        if (this.$store.state.role==="admin"){
          this.$notify.error({
            title: '错误',
            message: '管理员没有此权限'
          });
        } else {
          if(this.currentMenuItem === 'NewActivity'){
            this.refresh();
          }
          else{
            this.$router.push({path: './NewActivity'});
          }
        }
      },

      //跳转投稿
      goToAllConference(){
        if (this.$store.state.role==="admin"){
          this.$notify.error({
            title: '错误',
            message: '管理员没有此权限'
          });
        } else {
          if(this.currentMenuItem === 'AllConference'){
            this.refresh();
          }
          else{
            this.$router.push({path:'./ActivityList'});
          }
        }
      },

      //刷新页面
      refresh() {
        this.$router.go(0);
      },
    },
  }
</script>


