<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum" :loading="loading">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>个人信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
        <el-form-item label="账户ID" prop="userId">
          <el-input v-model="editForm.userId" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名"   prop="userName">
          <el-input v-model="editForm.userName" maxlength="20" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"  prop="phone">
          <el-input v-model.number="editForm.phone" maxlength="11" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"  prop="email">
          <el-input v-model="editForm.email" maxlength="50" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注"  prop="remark">
          <el-input type="textarea" v-model="editForm.remark" :rows="8" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="editSubmit">确认修改</el-button>
          <el-button @click="resetForm('editForm')">重置</el-button>
        </el-form-item>
      </el-form>

    </el-col>
  </el-row>
</template>

<script>
import API from "../../api/api_user";

export default {
  data() {
    //手机号校验
    var CheckTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("电话号码必须是数字"));
      } else if (value.toString().length != 11) {
        callback(new Error("电话号码必须是11位"));
      } else if (this.user.phone != value) {
        API.CheckPhon(value).then(
          function(result) {
            if (result.code === 0) {
              callback();
            } else {
              callback(new Error("手机号已存在"));
            }
          },
          function(err) {
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 3000
            });
          }
        );
      }else{
         callback();
      }
    };
    //邮箱校验
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        callback(new Error("请输入邮箱"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      loading: false,
      user: "",
      editForm: {
        userId: "",
        userName: "",
        phone: "",
        email: "",
        remark: "",
        role: ""
      },
      editFormVisible: false, //编辑界面是否显示
      editFormRules: {
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { max: 5, message: "最多 5 个字符", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            validator: CheckTel,
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: checkEmail,
            required: true,
            trigger: "blur"
          }
        ],
        remark: [{ max: 100, message: "长度小于200个字符", trigger: "blur" }]
      }
    };
  },
  methods: {
    //修改提交函数
    editSubmit: function() {
      let that = this;
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.loading = true;
          API.changeProfile(this.editForm)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 3000
                  });
                  window.localStorage.setItem(
                    "USER",
                    JSON.stringify(result.data)
                  );
                  that.$router.go(0);
                } else {
                  that.$message.error({
                    showClose: true,
                    message: "修改失败",
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    //初始化页面用户数据
    let that = this;
    let usertemp = localStorage.getItem("USER");
    that.user = JSON.parse(usertemp);
    if (that.user) {
      this.loading = true;
      var params = { userId: that.user.userId };
      API.getUserById(params)
        .then(
          function(result) {
            that.loading = false;
            if (result && parseInt(result.code) === 0) {
              that.editForm = result.data;
            } else {
              that.$message.error({
                showClose: true,
                message: "查询失败",
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
  }
};
</script>
