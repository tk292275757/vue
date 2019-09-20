<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片搜索区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delCate(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsInfo.pagesize"
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
      goodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.goodsInfo
      });
      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.$message.success("获取商品列表成功");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(res.data);

      console.log(this.goodsList);
    },
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.goodsInfo.pagenum = newPage;
      this.getGoodsList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>