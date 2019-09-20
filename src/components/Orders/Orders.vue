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
        <el-col :span="8">
          <!-- input文本框区域 -->
          <el-input class="int" width="300px" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!--tab主题内容区域  -->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="ordersList" style="width: 100%" border>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="175px"></el-table-column>
            <el-table-column prop="order_price" label="订单价格"></el-table-column>
            <el-table-column prop="pay_status" label="是否付款">
              <el-tag type="danger" v-if="'pay_status==0'">否</el-tag>
              <el-tag type="success" v-else>是</el-tag>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货"></el-table-column>
            <el-table-column prop="update_time" label="下单时间"></el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button icon="el-icon-edit" type="primary" size="mini"></el-button>
                <el-button icon="el-icon-location-outline" type="success" size="mini"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import "../../main";
export default {
  data() {
    return {
      // 分页信息
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      // 总页数
      total: 0,
      ordersList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表数据失败");
      }
      this.$message.success("获取订单数据列表成功");
      this.ordersList = res.data.goods;
      this.total = res.data.total;
      console.log(this.total);

      console.log(this.ordersList);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less">
.el-table {
  font-size: 12px;
}
</style>