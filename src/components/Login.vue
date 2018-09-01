<template>
  <el-form ref="AccountFrom" :model="account" :rules="rules" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">
      <!-- <a style="color:#365473">WISE-PaaS/</a> -->
      <a style="color:#0591D8">SRP状态监控系统</a>
    </h3>
    <el-form-item prop="phone">
      <el-input type="text" v-model.number="account.phone" maxlength="11" auto-complete="off" placeholder="手机号"></el-input>
    </el-form-item>
    <el-form-item prop="userPwd">
      <el-input type="password" maxlength="8" v-model="account.userPwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin('account')" :loading="loading">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import API from "../api/api_user";
export default {
  data() {
    //手机号校验函数：不为空，数字校验，位数校验
    var CheckTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("电话号码必须是数字"));
      } else if (value.toString().length != 11) {
        callback(new Error("电话号码必须是11位"));
      } else {
        callback();
      }
    };
    //密码校验函数：字母或数字校验
    var Mima = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(value)) {
        callback(new Error("请输入字母或数字组成的密码"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      account: {
        phone: "",
        userPwd: ""
      },
      rules: {
        phone: [
          {
            required: true,
            validator: CheckTel,
            trigger: "blur"
          }
        ],
        userPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 8,
            message: "请输入6至8位的密码",
            trigger: "blur"
          },
          {
            validator: Mima,
            trigger: "blur"
          }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    //登录函数：发送账号，密码到后台，获得状态码（用户判断登录成功与否）、用户数据和token（保存到vuex和localStorage）
    handleLogin() {
      let that = this;
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          that.loading = true;
          API.login(this.account)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$store.dispatch("getUserinfor", result.data);
                  that.$message.success({
                    showClose: true,
                    message: "登录成功",
                    duration: 3000
                  });
                  that.$router.push({
                    path: "/"
                  });
                } else {
                  that.$message.error({
                    showClose: true,
                    message: result.msg,
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
  }
};
</script>
<style>
html,
body {
  width: 100%;
  height: 100%;
}
body {
  background: url("../assets/back.jpg") no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 160px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  background: -ms-linear-gradient(top, #ace, #00c1de); /* IE 10 */
  background: -moz-linear-gradient(top, #ace, #00c1de); /*火狐*/
  background: -webkit-gradient(
    linear,
    0% 0%,
    0% 100%,
    from(#ace),
    to(#00c1de)
  ); /*谷歌*/
  background: -webkit-linear-gradient(
    top,
    #ace,
    #00c1de
  ); /*Safari5.1 Chrome 10+*/
  background: -o-linear-gradient(top, #ace, #00c1de); /*Opera 11.10+*/

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
}
</style>
