<template>
  <div class="login_conten">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 图片区域 -->
        <img src="../assets/logo.png" alt />
      </div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login_form">
        <!-- 用户 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 密码和重置 -->
        <el-form-item class="login_reset">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetloginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { sync } from "glob";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      //用户名和密码输入验证
      rules: {
        username: [
          { required: true, message: "请您输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请您输入密码", trigger: "blur" },
          { min: 6, max: 18, message: "长度在 6 到 18 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    resetloginForm() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      //   console.log(this);
      this.$refs.loginFormRef.validate(async val => {
        // 登录请求
        if (!val) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        console.log(res);
        // console.log(this.rules);
        if (res.meta.status != 200) return this.$message.error("登录失败！");
        this.$message.success("登录成功！");
        // 1、将登录成功之后token保存到客户端的sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2、通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_conten {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 150px;
  width: 150px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 12px;
  //   居中显示
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  // 显示阴影
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.login_reset {
  display: flex;
  justify-content: flex-end;
}
</style>
