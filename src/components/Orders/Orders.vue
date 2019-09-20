<template>
  <div>
    <el-breadcrumb>
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-table :data="ordersList" style="width: 100%">
            <!-- <el-table-column prop="date" label="日期" width="180"></el-table-column> -->
            <!-- <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column> -->
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import '../../main'
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5,
            },
            ordersList:[]
        }
    },
    create(){
        this.getOrdersList()
    },
    methods:{
       async getOrdersList(){
        const {data:res} =  await this.$http.get('orders')
        if(res.meta.status !== 200){
            this.$message.error('获取订单信息失败')
        }
        this.$message.success('获取订单信息成功')
        this.ordersList = res.data
        
        }
    }
};
</script>

<style lang="less">
</style>