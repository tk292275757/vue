<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- tab主题内容区域 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="RolesList" border>
        <!-- 展开页 -->
        <el-table-column type="expand">
          <template slot-scope="slotScope">
            <el-row
              :class="['dbBorder',i1 === 0 ? 'topBorder' : '','vccenter']"
              v-for="(item1,i1) in slotScope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2===0?'':'topBorder','vccenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRigthByid(slotScope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleDesc"></el-table-column>
        <el-table-column label="角色描述" prop="roleName"></el-table-column>
        <el-table-column label="操作" width="285px">
          <template slot-scope="slotScope">
            <!-- {{slotScope.row}} -->
            <!-- 修改 -->
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <!-- 删除 -->
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <!-- 设置 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" enterable>
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showRightsVisible(slotScope.row)"
                
              >分配权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限主题内容 -->
    <el-dialog title="分配权限" :visible.sync="setDialogVisible" width="50%" @close='setRigthsDialongClosed'>
      <!-- 树形控件 -->
      <el-tree
        :data="getRightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys='defKeys'
        ref='treeRef'
      ></el-tree>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allowRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RolesList: [],
      //对话框是否显示
      setDialogVisible: false,
      //  所有权限数据
      getRightsList: [],
      //   树形控件绑定对象
      treeProps: {
        children: "children",
        label: "authName"
      },
    //   默认选择节点id值数组
    defKeys:[],
    // 当前即将分配权限角色的id
    roleId:'',
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取用户列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.RolesList = res.data;
      //   console.log(this.RolesList);
    },
    // 根据id删除权限
    async removeRigthByid(role, rightId) {
      const resultConfirm = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (resultConfirm !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      //  console.log(res)
      role.children = res.data;
    },
    // 显示分配权限对话框
    async showRightsVisible(role) {
        this.roleId = role.id
        console.log(this.roleId );
        
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分配权限失败");
      }
      this.getRightsList = res.data;
      console.log(this.getRightsList);
    //   console.log(role);
      
        // 递归获取三级节点的id
        this.getLeafKeys(role,this.defKeys)
    // console.log(this.defKeys);
    
      this.setDialogVisible = true;
    },
    // 通过递归,获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr){
        // 当前node节点不包括children属性则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item => {
            this.getLeafKeys(item,arr)
        });
    },
    // 监听分配权限对话框关闭事件
    setRigthsDialongClosed(){
        this.defKeys = [];
    },
    //   点击为角色分配权限
 async allowRights(){
      const keys = [
          ...this.$refs.treeRef.getHalfCheckedKeys(),
         ...this.$refs.treeRef.getCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr);
    const {data:res}  =  await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
    if(res.meta.status !== 200){
      console.log(res.meta);
      
        return this.$message.error('角色分配权限失败')
    }
    this.$message.success('角色分配权限成功')
    this.getRolesList()
    this.setDialogVisible = false
  },
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.topBorder {
  border-top: 1px solid #eee;
}

.dbBorder {
  border-bottom: 1px solid #eee;
}

.vccenter {
  display: flex;
  align-items: center;
}
</style>
