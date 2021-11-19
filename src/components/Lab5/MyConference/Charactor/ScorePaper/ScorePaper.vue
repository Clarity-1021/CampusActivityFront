<style src="" lang="css" scoped></style>
<template>
  <div class="HomeDiv">
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
            <div style="font-size: 18px">审稿</div>
            <div style="border: solid 2px; width: 75px; border-radius: 10px; border-color: rgba(26, 188, 156, 0.45)"></div>
          </div>
        </div>

        <v-container class="text-left">
          <v-row class="px-4">
            <Strong class="title" v-html="title"></Strong>
          </v-row>

          <v-row class="mt-5 px-4">
            <p class="" style="color: #aaa">
              {{ abstract }}
            </p>
          </v-row>
          <v-container>
            <pdf
              :src="src"
            :page="currentPage"
            @num-pages="pageCount=$event"
            @page-loaded="currentPage=$event"
            @loaded="loadPdfHandler">
            </pdf>

            <v-row class="d-flex justify-center align-center">
              <v-col cols="1"></v-col>
              <v-col class="d-flex justify-center align-center">
                <el-button @click="changePdfPage(0)" icon="el-icon-arrow-left" size="small" plain circle disabled v-if="currentPage === 1"></el-button>
                <el-button @click="changePdfPage(0)" icon="el-icon-arrow-left" size="small" plain circle v-else></el-button>
                <div class="mx-4">{{currentPage}} / {{pageCount}}</div>
                <el-button @click="changePdfPage(1)" icon="el-icon-arrow-right" size="small" plain circle disabled v-if="currentPage === pageCount"></el-button>
                <el-button @click="changePdfPage(1)" icon="el-icon-arrow-right" size="small" plain circle v-else></el-button>
              </v-col>
              <v-col cols="1" class="d-flex justify-end">
                <el-button size="small" style="color: white" type="primary" @click="downloadPaper">下载</el-button>
              </v-col>
            </v-row>
          </v-container>

          <v-row class="mt-8 d-flex justify-center">
            <div style="width: 91%" class="d-flex justify-start align-center">
              <span class="px-2 d-block">稿件评分</span>
              <el-rate v-if="!modifyFlag&&view" disabled :max="4" v-model="value1" show-text :colors="colors" :texts="texts1"></el-rate>
              <!--待初审时显示这个可以修改的打分_jxw-->
              <el-rate v-else :max="4" v-model="value1" show-text :colors="colors" :texts="texts1"></el-rate>
            </div>
          </v-row>

          <v-row class="d-flex justify-center mt-5">
            <el-input
              v-if="!modifyFlag&&view"
              disabled
              type="textarea"
              placeholder="评语"
              v-model="textarea"
              maxlength="800"
              :rows="6"
              show-word-limit
              style="width: 90%"
            />

            <el-input
              v-else
              type="textarea"
              placeholder="评语"
              v-model="textarea"
              maxlength="800"
              :rows="6"
              show-word-limit
              style="width: 90%"
            />
          </v-row>

          <v-row class="mt-6 d-flex justify-center">
            <div style="width: 91%" class="d-flex justify-start align-center">
              <span class="px-2 d-block">Confidence</span>
              <el-rate v-if="!modifyFlag&&view" disabled :max="4" v-model="value2" show-text :colors="colors" :texts="texts2"></el-rate>
              <el-rate v-else :max="4" v-model="value2" show-text :colors="colors" :texts="texts2"></el-rate>
            </div>
          </v-row>

          <v-row class="mt-6 d-flex justify-center" v-if="rebuttalText!==''&&rebuttalText!==undefined">
            <div style="width: 91%" class="d-flex justify-start align-center">
              <span class="px-2 d-block">驳回申请</span>
            </div>
          </v-row>

          <v-row class="mt-2 d-flex justify-center" v-if="rebuttalText!==''&&rebuttalText!==undefined">
            <div style="width: 91%" class="d-flex justify-start align-center">
              <span class="px-2 d-block text--disabled subtitle-1 text-left" v-html="rebuttalText"></span>
            </div>
          </v-row>

          <v-row class="mt-6 d-flex justify-center">
            <el-button style="color: white" v-if="view==true&&!modifyFlag&&!(discussed===false&&mark=='1')" type="warning" @click="modifyScore">修改</el-button>
            <el-button style="color: white" v-if="modifyFlag" @click="cancelModify" type="warning">取消修改</el-button>

            <el-button style="color: white" v-if="view==true&&!modifyFlag" type="primary" @click="assureScore">确认</el-button>
            <el-button style="color: white" v-if="view==true&&modifyFlag" disabled type="primary">确认</el-button>
            <el-button style="color: white" v-if="textarea!==''&&value1!=0&&value2!=0&&!modifyFlag&&!view" type="primary" @click="submitScorePaper">提 交</el-button>
            <el-button style="color: white" v-if="(textarea===''||value1==0||value2==0)&&!modifyFlag" type="primary" disabled>提 交</el-button>

            <el-button style="color: white" v-if="textarea!==undefined&&value1!=undefined&&value2!=undefined&&textarea!==''&&value1!=0&&value2!=0&&modifyFlag" @click="submitScorePaper" type="warning">提交修改</el-button>
            <el-button style="color: white" v-if="(textarea===''||value1==0||value2==0)&&modifyFlag" disabled type="warning">提交修改</el-button>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>
<script>
  import pdf from 'vue-pdf'
  export default {
    components: {pdf},
    name: 'ScorePaper',
    data(){
      return{
        value1: 0,
        value2: 0,
        view:this.getQueryVariable("view")=='true'?true:false,
        paper_id:this.getQueryVariable("paper_id"),
        discussed:false,
        src: '',
        texts1: ['reject', 'weak reject', 'weak accept', 'accept'],
        texts2: ['very low' ,'low' , 'high' ,'very high'],
        values1: [-2,-1,1,2],
        values2: [0,1,2,3],
        prevValue1: 0,
        prevValue2:0,
        colors: ['#99A9BF','#99A9BF', '#F7BA2A', '#FF9900'],
        textarea: '',
        prevTextarea: '',
        title: '',
        abstract: '',
        currentPage: 0, // pdf文件页码
        pageCount: 0, // pdf文件总页数
        mark:this.getQueryVariable("mark"),
        modifyFlag: false,// 修改按钮的旗
        rebuttalText:'',
      };
    },
    mounted() {
      this.getInfo();
    },
    methods:{
      modifyScore(){
        this.modifyFlag = true;
      },

      cancelModify(){
        this.value1=this.prevValue1;
        this.value2=this.prevValue2;
        this.textarea=this.prevTextarea;
        this.modifyFlag = false;
      },

      assureScore(){
        this.$confirm('真的要确定吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.get('/affirm_result?paper_id='+this.paper_id+"&mark="+this.mark)
            .then(resp => {
              this.$message({
                showClose: true,
                message: '确认成功',
                type: 'success'
              });
              this.goBack();
            })
            .catch(error => {
              console.log(error);
            });
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消确认~',
            type: 'success'
          });
        });
      },

      changePdfPage (val) {
        // console.log(val)
        if (val === 0 && this.currentPage > 1) {
          this.currentPage--
          // console.log(this.currentPage)
        }
        if (val === 1 && this.currentPage < this.pageCount) {
          this.currentPage++
          // console.log(this.currentPage)
        }
      },

      // pdf加载时
      loadPdfHandler (e) {
        this.currentPage = 1 // 加载的时候先加载第一页
      },

      downloadPaper(){
        this.$axios.get('/get_paper?paper_id='+this.paper_id,{responseType: 'blob'})
          .then(resp => {
            const blob = new Blob([resp.data], {
              // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
              type: 'application/pdf;charset=UTF-8'
            });
            const a = document.createElement('a');
            // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
            const URL = window.URL || window.webkitURL;
            // 根据解析后的blob对象创建URL 对象
            const herf = URL.createObjectURL(blob);
            // 下载链接
            a.href = herf;
            // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
            a.download = decodeURIComponent(resp.headers["content-disposition"].split("=")[1]);
            console.log(resp.headers["content-disposition"]);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // 在内存中移除URL 对象
            window.URL.revokeObjectURL(herf);
          })
          .catch(error => {
            this.$router.go(-1);
            console.log(error);
          });
      },

      getInfo(){
        this.$axios.get('/view_paper?paper_id='+this.paper_id)
          .then(resp => {
            this.discussed=resp.data.discussed;
            this.title=resp.data.title;
            this.abstract=resp.data.summary;
          })
          .catch(error => {
            this.$router.go(-1);
            console.log(error);
          });

        if(this.view==true){
          this.$axios.get('/view_info?paper_id='+this.paper_id)
            .then(resp => {
              for (var i=0;i<this.values1.length;i++){
                if (this.values1[i]==resp.data.score) {
                  this.value1=i+1;
                  this.prevValue1=i+1;
                }
                if (this.values2[i]==resp.data.confidence) {
                  this.value2=i+1;
                  this.prevValue2=i+1;
                }
              }
              this.textarea=resp.data.comment;
              this.prevTextarea=resp.data.comment;
              this.rebuttalText=resp.data.rebuttal_content;
            })
            .catch(error => {
              console.log(error);
            });
        }

        var headers = {

          'Authorization': localStorage.getItem("token")

        };

        this.src = pdf.createLoadingTask({

          url:'http://114.115.160.219/api/read_paper?paper_id='+this.getQueryVariable("paper_id"),

          httpHeaders:headers

        });
      },

      // 提交
      submitScorePaper(){
        this.$confirm('确定提交吗？', '确认信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$axios.post('/submit_result', {
            mark:this.mark,
            edit:this.view,
            paper_id:this.paper_id,
            score:this.values1[this.value1-1],
            confidence:this.values2[this.value2-1],
            comment:this.textarea
          })
            .then(resp => {
              this.$message({
                showClose: true,
                message: '提交成功',
                type: 'success'
              });
              this.goBack();
            })
            .catch(error => {
              this.$notify.error({
                title: '提交失败',
                message: '重新提交试试吧！'
              });
              console.log(error);
            })
        }).catch(() => {
          //取消注销消息提示
          this.$message({
            showClose: true,
            message: '已取消提交~',
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

