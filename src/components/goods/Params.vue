<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片搜索区域 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <el-row class="paramsList">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="paramsSelect"
            :options="paramsList"
            :props="paramsProp"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="idBtnDisabled"
            size="mini"
            @click="addDialogVisible = true"
          >添加参数</el-button>
          <!-- 动态表格数据 -->
          <el-table :data="manyTableData" style="width: 100%" border>
            <!-- 展开列 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="attr_name" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialogVisible(scope.row.attr_id)"
                >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="idBtnDisabled"
            size="mini"
            @click="addDialogVisible = true"
          >添加属性</el-button>
          <!-- 静态表格数据 -->
          <el-table :data="onlyTableData" border>
            <!-- 展开列 -->
            <el-table-column type="expand"></el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column prop="attr_name" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialogVisible(scope.row.attr_id)"
                >修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数 -->
    <el-dialog
      :title="'添加' + textTitle"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogFrom"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 -->
    <el-dialog
      :title="'修改' + textTitle"
      :visible.sync="eidtDialogVisible"
      width="50%"
      @close="editDialogclose"
    >
      <el-form :model="editForm" :rules="eidtFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eidtDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
// import { runMain } from 'module';
export default {
  data() {
    return {
      paramsList: [],
      paramsSelect: [],
      paramsProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      activeName: "many",
      // 动态参数
      manyTableData: [],
      // 静态参数
      onlyTableData: [],
      // 添加参数显示与隐藏对话框
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ""
      },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "请您输入参数名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ]
      },
      // 修改参数表单数据对象
      editForm: {
        attr_name: ""
      },
      // 修改对话框显示与隐藏
      eidtDialogVisible: false,
      // 修改校验规则
      eidtFormRules: {
        attr_name: [
          {
            required: true,
            message: "请您输入参数名称",
            trigger: "blur"
          },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getParamsList();
  },
  computed: {
    idBtnDisabled() {
      if (this.paramsSelect.length !== 3) {
        return true;
      }
      return false;
    },
    //  当前选中的是三级分类id
    cateId() {
      if (this.paramsSelect.length == 3) {
        return this.paramsSelect[2];
      }
      return null;
    },
    textTitle() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    }
  },
  methods: {
    // 获取分类列表
    async getParamsList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类参数失败");
      }
      this.$message.success("获取分类参数成功");
      this.paramsList = res.data;
      // console.log(this.paramsList);
    },
    // 级联选择框发生变化的时候会触发这个函数
    handleChange() {
      this.getParamsData();
    },
    handleClick() {
      this.getParamsData();
      console.log(this.activeName);
    },
    // 获取参数的列表数据
    async getParamsData() {
      // 证明选择的不是三级分类
      if (this.paramsSelect.length !== 3) {
        this.paramsSelect = [];
        return;
      }
      // 证明是三级分类
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取参数列表失败");
      }
      if (this.activeName == "many") {
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else {
        this.onlyTableData = res.data;
      }
    },

    // 监听添加对话框关闭事件
    addDialogFrom() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定添加参数
    addParams() {
      this.$refs.addFormRef.validate(async val => {
        if (!val) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          this.$message.error("添加参数失败");
        }
        this.$message.success("添加参数成功");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 监听编辑对话对话框
    async showDialogVisible(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        { params: { attr_sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取编辑数据失败");
      }
      this.editForm = res.data
      this.eidtDialogVisible = true;
    },
    // 监听修改对话框关闭事件
    editDialogclose() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改参数对话框
    editParams() {
      this.$refs.editFormRef.validate( async vail=>{
        if(!vail) return
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
          attr_name:this.editForm.attr_name,attr_sel:this.activeName
        })
        if(res.meta.status !== 200){
          return this.$message.error('修改参数失败')
        } 
        this.$message.success('修改参数成功')
        this.getParamsData()
        this.eidtDialogVisible = false
      })
    },
    // 删除参数
   async delParams(attrId){
     console.log(attrId);
     
      const resultConfirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(resultConfirm !== 'confirm'){
           return this.$message.info('已取消删除')
        }
     const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
     if(res.meta.status !== 200){
       return this.$message.error('删除失败')
     }
        this.$message.success('已成功删除')
        this.getParamsData()
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
</style>