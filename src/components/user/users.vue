<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片面板 -->
    <el-card class="box-card">
      <!-- 添加用户 -->
      <el-row :gutter="20">
        <el-col :span="8"
          ><div class="grid-content bg-purple">
            <div>
              <el-input
                placeholder="请输入内容"
                class="input-with-select"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getUserList"
                ></el-button>
              </el-input>
            </div></div
        ></el-col>
        <el-col :span="2"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="addDialogVisible = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 用户列表 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- 操作模版 -->
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handlEdit(scope.row.id)"
            ></el-button>

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delOpen(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="handleSet(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <!-- form表单 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit按钮 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      width="50%"
      :before-close="editHandleClose"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="MeteditForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限按钮 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setDialogVisible"
      width="50%"
      :before-close="handleClose"
      :info="setForm"
    >
      <div>当前的用户：{{ setForm.username }}</div>
      <div>当前的角色：{{ setForm.role_name}}</div>
      <div>
        分配新角色：<el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      flag: false,
      addDialogVisible: false,
      editDialogVisible: false,
      setDialogVisible: false,
      addForm: {
        // 添加用户
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {
        //编辑用户
        username: "",
        email: "",
        mobile: "",
      },
      setForm: {},
      addRules: {
        // 添加用户校验规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: false, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: false, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      editRules: {
        email: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
       options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    };
  },
  methods: {
    getUserList() {
      //用户数据列表
      this.$http.get("users", { params: this.queryInfo }).then((result) => {
        if (result.data.meta.status !== 200) {
          //失败处理
          return this.$message.error(esult.data.meta.msg);
        }
        const { data: res } = result.data;
        this.userlist = res.users;
        this.total = res.total;
      });
    },
    handleSizeChange(a) {
      //列表显示条数
      this.queryInfo.pagesize = a;
      this.getUserList();
    },

    handleCurrentChange(a) {
      //当前页数
      this.queryInfo.pagenum = a;
      this.getUserList();
    },
    statusChange(a) {
      //状态切换
      if (this.flag) {
        //节流处理
        a.mg_state = !a.mg_state;
        return this.$message.warning("稍后再试");
      }
      this.flag = true;
      this.$http.put(`users/${a.id}/state/${a.mg_state}`).then((res) => {
        //请求
        if (res.data.meta.status !== 200) {
          //错误处理
          a.mg_state = !a.mg_state;
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success(res.data.meta.msg);
      });
      setTimeout(() => {
        this.flag = false;
      }, 1000);
    },

    handleClose() {
      this.addDialogVisible = false;
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
      });
      this.$http.post("/users", this.addForm).then((res) => {
        //添加用户请求
        if (res.data.meta.status !== 201) {
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success(res.data.meta.msg);
        this.addDialogVisible = false; //成功后关闭弹出层并且重新渲染页面
        this.getUserList();
      });
    },
    handlEdit(id) {
      this.editDialogVisible = true;
      this.$http.get(`users/${id}`).then((res) => {
        const { data } = res;
        if (data.meta.status !== 200) {
          return this.$message.error(data.meta.msg);
        }
        this.editForm = data.data;
      });
    },
    editHandleClose() {
      this.editDialogVisible = false;
    },
    MeteditForm() {
      this.$http.put(`users/${this.editForm.id}`, this.editForm).then((res) => {
        const { data } = res;
        if (data.meta.status !== 200) {
          return this.$message.error(data.meta.msg);
        }
        this.$message.success(data.meta.msg);
        this.editDialogVisible = false;
      });
    },
    delOpen(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`users/${id}`, { id }).then((res) => {
            const { data } = res;
            if (data.meta.status !== 200) {
              return this.$message.error(data.meta.msg);
            }
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getUserList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSet(id) {

      this.setDialogVisible = true;
      this.setForm = id;
    },
  },
  created() {
    //生命周期
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>