<style src="../../../static/mycss/NewConference.css" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
    <!--菜单-->
    <LeftMenu current-menu-item="NewConference" />
    <TopToolBar current-menu-item="NewConference" />

    <!--组件展示-->
    <div class="right-container">
      <div class="DisplayBox mt-12 mt-md-0">
        <!--第1行/抬头-->
        <div class="DisplayRow-1"><span class="smallTitle">创建活动</span></div>
        <!--第2行/注册表单-->
        <div class="DisplayRow-2">
          <el-form class="ConstructConfBox" cl :model="newConferenceForm" ref="newConferenceForm" :rules="rules" status-icon label-width="auto">  <!--相当于v-bind:model的缩写-->
            <el-form-item  label="活动名称" prop="abbr">
              <el-input style="width: 100%" autofocus v-model="newConferenceForm.abbr" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="活动简介" prop="fullName">
              <el-input style="width: 100%" v-model="newConferenceForm.fullName" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="举办方" prop="fullName">
              <el-input style="width: 100%" v-model="newConferenceForm.HosterName" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item  label="活动地点" prop="place" >
              <el-input style="width: 100%" v-model="newConferenceForm.place" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="活动时间" prop="jxwTest">
              <el-date-picker style="width: 100%" v-model="newConferenceForm.jxwTest" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>

            <el-form-item label="报名截止日期" prop="submissionDdl" placeholder="请输入投稿截止日期">
              <el-date-picker style="width: 100%" type="date" v-model="newConferenceForm.submissionDdl" placeholder="请选择" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>

            <el-form-item label="海报图片" prop="submissionDdl" placeholder="请输入投稿截止日期">
              <el-date-picker style="width: 100%" type="date" v-model="newConferenceForm.PosterPicure" placeholder="请选择" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button @click="submitForm('newConferenceForm')" type="primary" style="color: white">提 交</el-button>
              <el-button @click="resetForm('newConferenceForm')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'NewActivity',
    data(){
      var validateAddr = (rule,value,callback)=>{
        var pattern = /^[a-zA-Z0-9]+$/;
        if(value === ''){
          callback(new Error('活动简称不能为空'));
        }
        else if(!pattern.test(value)){
          callback(new Error('活动简称只能包含数字和字母'));
        }
        else{
          callback();
        }
      };

      var validDate = (rule,value,callback) => {
        callback(new Error(value))
        if((value[0]==="") || (value[1]==="")){
          callback(new Error("请选择时间"))
        }else{
          callback()
        }
      };

      var validateContributeDeadline = (rule,value,callback)=> {
        if (value >= this.newConferenceForm.jxwTest[0]) {
          callback(new Error('投稿截止日期必须在活动开始时间之前!'));
        }else if (value<new Date()){
          callback(new Error('投稿截止日期必须在未来!'));
        } else {
          callback();
        }
      };


      var validatePublishTime = (rule,value,callback)=> {
        if (value >= this.newConferenceForm.jxwTest[0]||value<=this.newConferenceForm.submissionDdl) {
          callback(new Error('评审发布时间必须在活动开始之前和投稿截止之后!'));
        } else {
          callback();
        }
      };


      return{
        // 新增start 临时定的可以改
        topicCanBeChosen: ['计算机图形学', '软件质量测试', '机器学习','信息编码论', '算法', '程序设计理论','数据库', '计算机体系结构', '软件工程','并发，并行和分布式系统'],// 可选topic
        topicChosen: [],// 已选topic
        inputVisible: false,// 控制topic输入框是否出现的旗
        inputValue: '',// topic输入框绑定的值
        // 新增end

        //时间选择禁用今天（不包括今天）以前的日期
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },

        dialogFormVisible : false,

        newConferenceForm: {
          abbr:'',
          fullName:'',
          place:'',
          submissionDdl:'',
          publishTime:'',
          jxwTest: [],
        },

        rules: {
          abbr: [
            { required: true, message: '活动简称不能为空', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' },
            {validator: validateAddr, trigger: 'blur'}
    ],
          fullName:[
            { required: true, message: '请输入活动全称', trigger: 'blur' },
          ],
          jxwTest: [
            {required: true, message: '请输入活动时间', trigger: 'blur' },
          ],
          place: [
            {required: true, message: '请输入活动举办地点', trigger: 'blur' }
          ],
          submissionDdl: [
            {required: true, message: '请输入投稿截止日期', trigger: 'blur' },
            {validator: validateContributeDeadline, trigger: 'blur'}
          ],
          publishTime: [
            {required: true, message: '请输入评审结果发布日期', trigger: 'blur' },
            {validator: validatePublishTime, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      // 新增topic相关函数start
      addTopic(tag){
        //if (this.topicChosen.indexOf(tag)===-1){
          this.topicChosen.push(tag);
          this.topicCanBeChosen.splice(this.topicCanBeChosen.indexOf(tag),1);
      },

      deleteTopic(tag){
          this.topicCanBeChosen.push(tag);
          this.topicChosen.splice(this.topicChosen.indexOf(tag),1);
      },

      // 点击添加话题按钮后显示topic输入框
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          if (this.topicChosen.indexOf(inputValue) === -1) {
            this.topicChosen.push(inputValue);
          } else {
            this.$notify.info({
              title: '添加话题失败',
              message: '已经添加该话题，请勿重复添加~'
            });
          }
        }

        this.inputVisible = false;
        this.inputValue = '';
      },
      // 新增topic相关函数end

      submitForm(formName) {
        if (this.topicChosen.length>=1) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm('确定创建此活动吗？', '确认信息', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                this.$axios.post('/newconference', {
                  abbr: this.newConferenceForm.abbr,
                  fullName: this.newConferenceForm.fullName,
                  startTime: this.newConferenceForm.jxwTest[0],
                  endTime: this.newConferenceForm.jxwTest[1],
                  place: this.newConferenceForm.place,
                  submissionDdl: this.newConferenceForm.submissionDdl,
                  publishTime: this.newConferenceForm.publishTime,
                  topics: this.topicChosen
                })
                  .then(resp => {
                    if (resp.status === 200) {
                      this.$notify({
                        title: '提交成功，请耐心等待管理员批准。',
                        type: 'success'
                      });
                      this.$refs[formName].resetFields();
                    }
                  })
                  .catch(error => {
                    this.$notify.error({
                      title: '创建失败',
                      message: '数据不符合要求！'
                    });
                    console.log(error)

                  })
              }).catch(() => {
                //取消注销消息提示
                this.$message({
                  showClose: true,
                  message: '已取消创建~',
                  type: 'success'
                });
              });

            }
          });
        }else {
          this.$notify.info({
            title: '无法创建',
            message: '话题数目必须不少于1~'
          });
        }
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    },
  }
</script>

