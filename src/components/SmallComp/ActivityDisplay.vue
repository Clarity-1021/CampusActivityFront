<style src="../../../static/mycss/Lab3/LeftMenu.css" lang="css" scoped></style>
<template>
  <div style="width: 100%">

    <!--选择排版-->
    <v-row style="margin: 0">
      <v-chip-group v-model="selection" active-class="deep-purple accent-4 white--text" column mandatory>
        <v-chip>卡片</v-chip>
        <v-chip>表格</v-chip>
      </v-chip-group>
    </v-row>
    <!--卡片-->
    <v-data-iterator v-if="IsSelectionCard" :items="items" :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="mx-auto">

              <v-img height="250" src="https://cdn.vuetifyjs.com/images/cards/cooking.png"></v-img>

              <v-card-title>{{item.FullName}}</v-card-title>

              <v-card-text>
                <!--                      <v-row align="center" class="mx-0">-->
                <!--                        <v-rating-->
                <!--                          :value="4.5"-->
                <!--                          color="amber"-->
                <!--                          dense-->
                <!--                          half-increments-->
                <!--                          readonly-->
                <!--                          size="14"-->
                <!--                        ></v-rating>-->

                <!--                        <div class="grey&#45;&#45;text ms-4">-->
                <!--                          4.5 (413)-->
                <!--                        </div>-->
                <!--                      </v-row>-->

                <!--                      <div class="text-subtitle-1">-->

                <v-row class="mx-0" align="left">
                  {{item.Hoster}}
                </v-row>
                <v-row class="mx-0" align="left">
                  {{item.StartTime}}
                </v-row>
                <v-row class="mx-0" align="left">
                  {{item.Place}}
                </v-row>

                <v-row class="mx-0 mt-3" align="left">
                  <v-chip>{{item.State}}</v-chip>
                </v-row>

                <!--                      </div>-->

                <!--                      <div>Small plates, salads & sandwiches - an intimate setting with 12 indoor seats plus patio seating.</div>-->
              </v-card-text>

              <v-divider class="mx-4"></v-divider>

              <v-card-actions>
                <v-btn color="green" text @click="CheckDetail(item)">
                  查看详情
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

      </template>
      <template v-slot:footer>
        <v-pagination color="green darken-3" v-model="page" :length="numberOfPages" :total-visible="itemsPerPage"></v-pagination>
      </template>
    </v-data-iterator>
    <!--表格-->
    <div v-else style="width: 100%">
      <v-data-table sort-by="loanDate" sort-desc :headers="headers" :items="items" :page.sync="page" :items-per-page="itemsPerPage" hide-default-footer class="elevation-1" @page-count="numberOfPages">
        <template v-slot:item.cz="{ item }">
          <v-btn color="green" text @click="CheckDetail(item)">
            查看详情
          </v-btn>
        </template>
      </v-data-table>
      <v-pagination class="mt-3" color="green darken-3" v-model="page" :length="numberOfPages" :total-visible="itemsPerPage"></v-pagination>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ActivityDisplay',
  data(){
    return{
      selection: 0,
      headers: [
        { text: '活动全称', value: 'FullName', sortable: false, align: 'center' },
        { text: '主办方', value: 'Hoster', sortable: false, align: 'center' },
        { text: '活动地点', value: 'Place', sortable: false, align: 'center' },
        { text: '开始日期', value: 'StartTime', sortable: true, align: 'center' },
        { text: '活动状态', value: 'State', sortable: false, align: 'center' },
        { text: '操作', value: 'cz', sortable: false, align: 'center' },
      ],
      page: 1,
      itemsPerPage: 8,
    };
  },
  props:{
    items:{
      type: Set,
      default: [],
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    IsSelectionCard () {
      return this.selection === 0;
    },
  },
  mounted() {
  },
  methods: {
    CheckDetail (item) {
      console.log(item.StartTime)
      this.$router.push({path:'./ActivityDetail'})
    },
  },
}
</script>




