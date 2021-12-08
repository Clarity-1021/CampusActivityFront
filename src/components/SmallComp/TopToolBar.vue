<style src="" lang="css" scoped></style>
<template>
  <v-container-fluid>
    <v-app-bar dark class="d-md-none d-block" dense absolute color="#2c3e50" elevate-on-scroll scroll-target="#scrolling-techniques-7">

      <!--主页-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="goToHome">
            <v-icon>mdi-home</v-icon>
          </v-btn>
        </template>
        <span>主页</span>
      </v-tooltip>

      <v-toolbar-title class="d-none d-sm-flex ">Conference System</v-toolbar-title>
      <v-toolbar-title class="d-xs-flex d-sm-none">CS</v-toolbar-title>
      <v-spacer></v-spacer>

      <!--创建会议-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="goToNewConference">
            <v-icon>mdi-playlist-plus</v-icon>
          </v-btn>
        </template>
        <span>创建活动</span>
      </v-tooltip>

      <!--所有会议-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="goToAllConference">
            <v-icon>mdi-account-group</v-icon>
          </v-btn>
        </template>
        <span>所有活动</span>
      </v-tooltip>

      <!--我的会议-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="goToMyConference">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <span>我的活动</span>
      </v-tooltip>

      <!--消息中心-->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="goToMessage">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </template>
        <span>消息中心</span>
      </v-tooltip>

      <div style="position: relative">
        <el-badge :value="this.record" :max="10" style="position: absolute;left: -22px; top: -15px" v-if="this.record !== 0"></el-badge>
      </div>

      <el-dropdown @command="handleCommand" :hide-on-click="false">
        <div class="AvatarBox"><!--头像外框-->
          <v-avatar class="mx-2" color="indigo" size="36">
            <img :src="url" :alt="myname" v-if="myname !== 'admin'" />
            <img :src="adminUrl" alt="管理员" v-else />
          </v-avatar>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">查看大图</el-dropdown-item>
          <el-dropdown-item command="c">我的信息</el-dropdown-item>
          <el-dropdown-item command="d">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </v-app-bar>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="url" alt="" v-if="myname !== 'admin'">
      <img width="100%" :src="adminUrl" alt="" v-else>
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
  </v-container-fluid>

</template>


<script>
  export default {
    name: 'topToolBar',
    data(){
      return{
        avatarItems: [
          { title: '注销' },
        ],

        record:0,
        realname:'',
        organization:'',
        region:'',
        email:"",
        myname:localStorage.getItem("username"),
        url:"../../../static/images/默认头像.jpg",
        adminUrl:"../../../static/images/管理员头像.PNG",

        dialogVisible: false,
        dialogVisible2: false,
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
            this.$router.push({path: './MyActivityCreated'});
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
          if(this.currentMenuItem === 'NewConference'){
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


