<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片搜索区域 -->
    <el-card class="box-card">
      <!--  搜索与添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- tab表格，用户信息区域 -->
      <el-table :data="userList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="slotScope">
            <!-- {{slotScope.row}} -->
            <el-switch v-model="slotScope.row.mg_state" @change="switchChange(slotScope.row)"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="210px">
          <template slot-scope="slotScope">
            <!-- {{slotScope.row}} -->
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showUserVisible(slotScope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="delUserVisible(slotScope.row.id)"
            ></el-button>
            <!-- 设置 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" enterable>
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加用户内容主题 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog title="修改用户" :visible.sync="editUserVisible" width="50%" @close="editUserClosed">
      <!-- 修改用户内容区域 -->
      <el-form :model="editForm" :rules="eitdFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import "../../main";
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }

      cb(new Error("请输入合法的邮箱"));
    };

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      // 获取用户列表参数
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      //
      addDialogVisible: false,
      // 添加用户
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: "请您输入用户名",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请您输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请您输入邮箱",
            trigger: "blur"
          },

          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请您输入手机号",
            trigger: "blur"
          },

          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      addFormRef: {},

      // 修改用户对话框显示
      editUserVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: ""
      },
      eitdFormRules: {
        email: [
          {
            required: true,
            message: "请您输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],

        mobile: [
          {
            required: true,
            message: "请您输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      editFormRef: ""
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });

      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      // console.log(this.userList);

      // console.log(res.data.total);

      this.total = res.data.total;
      // console.log(res);

      // console.log(this.userList);
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);

      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听switch开关状态的改变
    async switchChange(switchInfo) {
      // console.log(switchInfo);
      const { data: res } = await this.$http.put(
        `users/${switchInfo.id}/state/${switchInfo.mg_state}`
      );
      console.log(res);
      if (res.meta.status !== 200) {
        switchInfo.mg_state = !switchInfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      return this.$message.success("更新用户状态成功");
    },
    // 监听用户添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加预校验
    addUser() {
      this.$refs.addFormRef.validate(async val => {
        // console.log(val);
        if (!val) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        // 隐藏添加对话框
        this.addDialogVisible = false;
        // 重新获取数据
        this.getUserList();
      });
    },
    // 编辑用户对话框
    async showUserVisible(id) {
      console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("修改用户失败");
      }
      this.editForm = res.data;
      console.log(res);
      console.log(res.data);

      this.editUserVisible = true;
    },
    // 监听用户修改对话框关闭事件
    editUserClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户并提交，预校验
    editUserInfo() {
      this.$refs.editFormRef.validate(async val => {
        console.log(val);
        if (!val) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改用户失败");
        }
        this.$message.success("修改用户成功");
        this.editUserVisible = false;
        this.getUserList();
      });
    },
    // 删除用户
    async delUserVisible(id) {
      console.log(id);
      const resultComfirt = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).cache(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getUserList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
