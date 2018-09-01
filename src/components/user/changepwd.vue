<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form :model="form" label-width="100px" :rules="FormRules" ref="form">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="form.oldPwd" maxlength="8" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="form.newPwd" maxlength="8" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="form.confirmPwd" maxlength="8" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="handleChangepwd">确认修改</el-button>
          <!-- <el-button @click="resetForm('editForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_user";
export default {
  data() {
    //密码校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.confirmPwd !== "") {
          this.$refs.form.validateField("confirmPwd");
        }
        callback();
      }
    };
    //确认密码校验
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      userId: "",
      form: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      },
      FormRules: {
        oldPwd: [
          {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          {
            min: 6,
            max: 8,
            message: "请输入6至8位的原密码",
            trigger: "blur"
          }
        ],
        newPwd: [
          {
            validator: validatePass,
            required: true,
            trigger: "blur"
          },
          {
            min: 6,
            max: 8,
            message: "请输入6至8位的新密码",
            trigger: "blur"
          }
        ],
        confirmPwd: [
          {
            validator: validatePass2,
            required: true,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //密码修改提交,修改成功跳转到登录页，清除localStorage中的用户信息
    handleChangepwd() {
      let that = this;
      console.log(this.form);
      let params = this.form;
      params["userId"] = this.userId;
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          API.changePwd2(params)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功,请重新登录",
                    duration: 3000
                  });
                  setTimeout(function() {
                    localStorage.removeItem("AUTH_TOKEN");
                    localStorage.removeItem("USER");
                    that.$router.go("/login"); //用go刷新
                  }, 2000);
                } else {
                  that.$message.error({
                    showClose: true,
                    message: "原密码错误",
                    duration: 3000
                  });
                }
              },
              function(err) {
                that.loading = false;
                that.$message.error({
                  showClose: true,
                  message: err.toString(),
                  duration: 3000
                });
              }
            )
            .catch(function(error) {
              that.loading = false;
              console.log(error);
              that.$message.error({
                showClose: true,
                message: "请求出现异常",
                duration: 3000
              });
            });
        }
      });
    }
  },
  mounted() {
    //页面用户数据初始化
    let user = localStorage.getItem("USER");
    if (user) {
      user = JSON.parse(user);
      this.userId = user.userId;
    }
  }
};
</script>
