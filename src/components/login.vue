<template>
  <div class="login_container">
    <!-- 登陆盒子 -->
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 头像盒子结束 -->
      <el-form ref="form" :model="loginForm" :rules="rules" class="login_form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            p
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-goods"
          ></el-input>
        </el-form-item>
        <el-form-item class="button" prop="password">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resets">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 登陆盒子结束 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "change" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resets() {
      console.log(this);
      this.$refs.form.resetFields();
    },
    login() {
      this.$refs.form.validate((res) => {
        if (!res) return;
        this.$http.post("login", this.loginForm).then((result) => {
          console.log(result);
          if (result.data.meta.status !== 200)
            return this.$message.error("错了哦，这是一条错误消息");
          this.$message({
            message: "恭喜你，这是一条成功消息",
            type: "success",
          });
          sessionStorage.setItem("token", result.data.data.token);
          this.$router.push("/home");
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
}
.avatar_box {
  margin: -65px auto;
  overflow: hidden;
  height: 130px;
  width: 130px;
  border: 10px solid #fff;

  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #eee;

  img {
    width: 100%;
    height: 100%;
  }
}
.button {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 0;
}
</style>
