<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header">
        <img src="../assets/heima.png" alt="黑马程序员" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="gada==true ?'65px':'200px'" >
        <div class="toggle-button" @click='toggelCollapse'>|||</div>
        <!-- 侧边栏导航 -->
        <el-menu
          background-color="#353742"
          text-color="#fff"
          active-text-color="#5A9BF6"
          :collapse='gada'
          :collapse-transition='false'
          router
          :default-active='$route.path'
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''"  v-for="item in menulist" :key='item.id'>
            <!-- 一级菜单模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-cpu"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            
            <!-- 二级菜单模版区域 -->
            <el-menu-item :index='"/"+ite.path' v-for="ite in item.children" :key='ite.id'>
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ite.authName}}</span>
            </el-menu-item>
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data(){
    return {
      menulist:[],
      gada:false,
      path:''

    }
  },
  methods: {
    
    exit() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    toggelCollapse(){   //菜单切换展开函数
      this.gada = !this.gada
    },
    getMenuList() {
      console.log(this);
      //获取菜单
      this.$http.get("menus").then((result) => {
        if(result.data.meta.status !== 200) {
          return this.$message.error(result.data.meta.error)
        }
        console.log(result);
        const { data: res } = result.data;
        this.menulist = res
        console.log(this.menulist);
      });
    },
  },
  created() {
    this.getMenuList();
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #383d41;
}
.el-aside {
  background-color: #343743;
 .el-menu {
   border-right: none;
 }
}
.el-main {
  background-color: #ebedf1;
}

.el-header {
  padding-left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    margin-left: 15px;
    color: #fff;
    font-size: 22px;
  }
  .header {
    display: flex;
    align-items: center;
  }
}
.toggle-button {
background-color: #4a5064;
font-size: 10px;
line-height: 24px;
color: #fff;
text-align: center;
letter-spacing: 0.2em;
cursor: pointer;

}
</style>