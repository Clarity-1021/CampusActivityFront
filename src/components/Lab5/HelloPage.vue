<style src="../../../static/mycss/Lab3/Home.css" lang="css" scoped></style>
<template>
  <div style="background: #f6f6f6; height: 100vh;" class="d-flex flex-column align-center justify-start">
    <div class="sm-shadow" style="width: 100%; flex: 0.5; background-image: url('../../../static/images/ActivityPics/SayHello.jpg'); background-position: top center; font-weight: bold; text-transform: uppercase; "><!--Logo-->
      <svg viewBox="0 0 1000 300" style="">
        <symbol id="line-text">
          <text style="font-size: 133px;" text-anchor="middle" x="50%" y="45%">Campus</text>
          <text style="font-size: 133px;" text-anchor="middle" x="50%" y="90%">Activity</text>
        </symbol>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
        <use xlink:href="#line-text" class="text"></use>
      </svg>
    </div>

    <v-container style="flex: 2; background: #ffffff; border-radius: 18px" class="my-3 d-flex flex-column justify-start align-center">
      <div class="my-2" style="color: #777">
        发起、参与有趣的校园活动<br />
      </div>

      <div class="my-3">
        <el-button type="primary" @click="goToLogin()" style="color: white">开始吧 !</el-button>
      </div>

      <div class="my-3" style="width: 100%">
        <v-carousel v-model="model">
          <v-carousel-item
            v-for="(picture, i) in pictures"
            :key="i"
            :src="picture"
          >
          </v-carousel-item>
        </v-carousel>
      </div>

      <div style="width: 100%; height: 50px">
        <div style="width: 120px; height: 100%" class="d-flex flex-column justify-center align-center">
          <div style="font-size: 18px">近期活动</div>
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
                    <span>活动全称</span>
                  </v-col>
                  <v-col class="text-center" cols="3">
                    <span>开始日期</span>
                  </v-col>
                  <v-col class="text-center" cols="4">
                    <span>活动状态</span>
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
                  <!--活动全称-->
                  <v-col class="text-center textOverFlowHidden" cols="5">
                    <strong title="点击显示会议详情" v-html="conference.fullname"></strong>
                  </v-col>
                  <!--活动开始时间-->
                  <v-col class="text-center textOverFlowHidden" cols="3">
                    <strong title="点击显示会议详情" v-html="conference.start_time"></strong>
                  </v-col>
                  <!--活动状态-->
                  <v-col class="text-center" cols="4">
                    <el-tag class="tag-default" type="danger" effect="plain">{{conference.tag}}</el-tag>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>

              <v-expansion-panel-content><!--展开文本-->
                <v-divider></v-divider><!--分割线-->
                <v-card-text>
                  <v-row class="text-justify">
                    <v-col cols="6">主办方：{{conference.chair_name}}</v-col>
                    <v-col cols="6">活动地点：{{conference.place}}</v-col>
                  </v-row>
                  <v-row class="text-justify">
                    <v-col cols="12">活动时间：{{conference.start_time}} ~ {{conference.end_time}}</v-col>
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
    name: 'HelloPage',
    data() {
      return{
        conferences:[],
        number:0,
        record:0,
        model: 0,
        pictures : [
          '../../../static/images/ActivityPics/PlayCards.jpg',
          '../../../static/images/ActivityPics/SayHello.jpg',
          '../../../static/images/ActivityPics/EatChips.jpg',
          '../../../static/images/ActivityPics/DiaoFish.jpg'
        ]
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
