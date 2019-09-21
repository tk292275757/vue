<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 2、准备具备大小的容器 -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1、引入echerts文件
import echarts from "echarts";
// 两个对象合并
import _ from 'lodash'
export default {
  data() {
    return {
        // 需要用的数据合并
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  created() {},
  methods: {},
  // 此时，页面上的dom元素已经渲染完毕了
  async mounted() {
    // 3基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));
    


    // 向服务器获取数据
   const {data:res} = await this.$http.get('reports/type/1')
   if(res.meta.status !== 200){
       return this.$message.error('获取数据统计失败')
   }
//    console.log(res.data);

   // 4、准备数据和配置项
   const result =  _.merge(res.data,this.options)
   

    // 5、展示数据
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
  }
};
</script>

<style lang="less" scoped>
</style>