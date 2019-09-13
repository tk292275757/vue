<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->

      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="togoleCollapse" @click="togoleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="isIcon[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!--二级菜单 -->
            <el-menu-item
              :index="'/'+value.path"
              v-for="value in item.children"
              :key="value.id"
              @click="saveNavState('/'+value.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{value.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主题内容 -->
      <el-main>
          <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import '../main'
export default {
  data() {
    return {
      menuList: [],
      isIcon: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      // 是否折叠
      isCollapse: false,
      // 显示高亮
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    //   console.log(this.menuList);
    },
    // 取反
    togoleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less">
.container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    // 纵向显示
    align-items: center;
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}
.togoleCollapse {
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  line-height: 24px;
  cursor: pointer;
  font-size: 10px;
  letter-spacing: 0.2em;
}


</style>p
