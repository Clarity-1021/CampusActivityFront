<style src="../../../static/mycss/Lab3/Home.css" lang="css" scoped></style>
<template>
  <div style="background: #f6f6f6; height: 100vh;" class="d-flex flex-column align-center justify-start">
    <div class="sm-shadow" style="width: 100%; flex: 0.5; background-image: url('../../../static/images/打牌-78.png'); background-position: top center; font-weight: bold; text-transform: uppercase; "><!--Logo-->
      <svg viewBox="0 0 1000 300" style="">
        <symbol id="line-text">
          <text style="font-size: 133px;" text-anchor="middle" x="50%" y="45%">Conference</text>
          <text style="font-size: 133px;" text-anchor="middle" x="50%" y="90%">System</text>
        </symbol>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
      </svg>
    </div>

    <v-container style="flex: 2; background: #ffffff; border-radius: 18px" class="my-3 d-flex flex-column justify-start align-center">
      <div class="my-2" style="color: #777">
        可以通过开设会议来征集你需要的稿件，筛选论文，并对它们进行评分<br />
      </div>

      <div class="my-3">
        <el-button type="primary" @click="goToLogin()" style="color: white">开始吧 !</el-button>
      </div>

      <div style="width: 100%; height: 50px">
        <div style="width: 120px; height: 100%" class="d-flex flex-column justify-center align-center">
          <div style="font-size: 18px">近期会议</div>
          <div style="border: solid 2px; width: 100px; border-radius: 10px; border-color: rgba(26, 188, 156, 0.45)"></div>
        </div>
      </div>

      <div style="width: 100%" class="my-3">
        <v-row justify="center">
          <v-expansion-panels popout>
            <v-expansion-panel hide-actions>
              <v-expansion-panel-header><!--简要条目陈列-->
                <template v-slot:actions>
                  <v-icon>mdi-card-bulleted</v-icon>
                </template>
                <v-row align="center" class="spacer" no-gutters>
                  <v-col class="text-center" cols="5">
                    <span>会议全称</span>
                  </v-col>
                  <v-col class="text-center" cols="3">
                    <span>开始日期</span>
                  </v-col>
                  <v-col class="text-center" cols="4">
                    <span>会议状态</span>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
            </v-expansion-panel>

            <v-expansion-panel hide-actions v-if="number === 0">
              <v-expansion-panel-header>
                <template v-slot:actions>
                  <v-icon color="warning">mdi-alert-decagram-outline</v-icon>
                </template>
                <v-row align="center" class="spacer" no-gutters>
                  <v-col class="text-center" cols="12">
                    <strong>无会议</strong>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
            </v-expansion-panel>

            <v-expansion-panel v-for="conference in conferences" :key="conference" hide-actions><!--会议条目循环-->
              <v-expansion-panel-header><!--简要条目陈列-->
                <v-row align="center" class="spacer" no-gutters>
                  <v-col class="text-center textOverFlowHidden" cols="5">
                    <strong title="点击显示会议详情" v-html="conference.fullname"></strong>
                  </v-col>
                  <v-col class="text-center textOverFlowHidden" cols="3">
                    <strong title="点击显示会议详情" v-html="conference.start_time"></strong>
                  </v-col>
                  <v-col class="text-center" cols="4">
                    <el-tag class="tag-default" type="danger" effect="plain">投稿中</el-tag>
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
      </div>

    </v-container>



  </div>
</template>
<script>
  export default {
    name: 'CS',
    data() {
      return{
        conferences:[],
        number:0,
        record:0
      }
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getInfo() {
        this.$axios.get('/home?page=1')
          .then(resp => {
            this.number = resp.data.number;
            this.record = resp.data.record;
            this.conferences = resp.data.conferences;
          })
          .catch(error => {
            console.log(error);
          });

      },

      goToLogin(){
        this.$router.push({path: './Login'});
      },
    }
  }
</script>
