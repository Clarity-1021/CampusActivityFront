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
            <el-form-item  label="活动名称" prop="FullName">
              <el-input style="width: 100%" autofocus v-model="newConferenceForm.FullName" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="活动简介" prop="Abstract">
              <el-input style="width: 100%" v-model="newConferenceForm.Abstract" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="举办方" prop="Hoster">
              <el-input style="width: 100%" v-model="newConferenceForm.Hoster" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item  label="活动地点" prop="Place" >
              <el-input style="width: 100%" v-model="newConferenceForm.Place" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="活动时间" prop="ActivityTime">
              <el-date-picker style="width: 100%" v-model="newConferenceForm.ActivityTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>

            <el-form-item label="报名时间" prop="ApplyTime">
              <el-date-picker style="width: 100%" v-model="newConferenceForm.ApplyTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions0"></el-date-picker>
            </el-form-item>

            <el-form-item label="海报图片" prop="PosterPicture">
              <el-upload
                class="upload-demo"
                drag
                ref="upload" action="#" accept=".jpg"
                :http-request="uploadSubmit"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-change="handleProgress"
                :on-exceed="handleExceed"
                :before-remove="beforeRemove"
                :file-list="fileList"
                list-type="picture"
                :limit="1">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
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
        if (value >= this.newConferenceForm.jxwTest1[0]) {
          callback(new Error('投稿截止日期必须在活动开始时间之前!'));
        }else if (value<new Date()){
          callback(new Error('投稿截止日期必须在未来!'));
        } else {
          callback();
        }
      };


      var validatePublishTime = (rule,value,callback)=> {
        if (value >= this.newConferenceForm.jxwTest1[0]||value<=this.newConferenceForm.submissionDdl) {
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
          FullName:'',
          Abstract:'',
          Hoster:'',
          Place:'',
          ActivityTime: [],
          ApplyTime: [],
        },

        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],

        rules: {
          FullName:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ],
          Abstract: [
            {required: true, message: '请输入活动简介', trigger: 'blur' },
          ],
          Hoster: [
            {required: true, message: '请输入举办方', trigger: 'blur' },
          ],
          Place: [
            {required: true, message: '请输入活动地点', trigger: 'blur' },
          ],
          ActivityTime: [
            {required: true, message: '请输入活动时间', trigger: 'blur' },
          ],
          ApplyTime: [
            {required: true, message: '请输入报名时间', trigger: 'blur' },
          ],
        }
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },

      // uploadSubmit(param){
      //   this.$refs['submitForm'].validate((valid) => {
      //     if (valid){
      //       this.$confirm('确定上传吗？', '确认信息', {
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //       }).then(() => {
      //         var fileObj = param.file;
      //         var form = new FormData();
      //         var params;
      //         if (this.modify===0) {
      //           params = JSON.stringify({
      //             "conference_id": this.conference_id,
      //             "title": this.submitForm.paperTitle,
      //             "summary": this.submitForm.paperAbstract,
      //             "topics": this.topicChosen,
      //             "authors": this.tableData
      //           });
      //         }else {
      //           params=JSON.stringify({
      //             "paper_id": this.getQueryVariable("paper_id"),
      //             "title": this.submitForm.paperTitle,
      //             "summary": this.submitForm.paperAbstract,
      //             "topics": this.topicChosen,
      //             "authors": this.tableData
      //           });
      //         }
      //         form.append("file", fileObj);
      //         form.append("params",new Blob([params], {type: "application/json"}));
      //         if (fileObj.type!=="application/pdf"){
      //           this.$notify.error({
      //             title: '文件类型错误',
      //             message: '文件必须为PDF格式'
      //           });
      //         }else if (fileObj.size>1000000) {
      //           this.$notify.error({
      //             title: '文件过大',
      //             message: '文件大小不能超过1M'
      //           });
      //         }else {
      //           var target;
      //           if(this.modify===0){
      //             target='/submit_paper';
      //           }else {
      //             target='./submit_edited_file';
      //           }
      //           this.$axios.post(target,
      //             form,{
      //               headers: {
      //                 'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
      //               }
      //             })
      //             .then(resp => {
      //               this.$message({
      //                 showClose: true,
      //                 message: '提交成功',
      //                 type: 'success'
      //               });
      //               this.$router.go(-1);
      //             })
      //             .catch(error => {
      //               this.$notify.error({
      //                 title: '文件上传失败',
      //                 message: '您可以再次尝试'
      //               });
      //               console.log(error);
      //
      //             });
      //         }
      //       }).catch(() => {
      //         //取消注销消息提示
      //         this.$message({
      //           showClose: true,
      //           message: '已取消上传~',
      //           type: 'success'
      //         });
      //       });
      //     }else{
      //       console.log('提交失败!');
      //       return false;
      //     }
      //   });
      //
      // },

      submitForm(formName) {
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
        })
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

    },
  }
</script>

