<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>账户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">全部删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="datapage" highlight-current-row @selection-change="selsChange" stripe style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="userId" label="账户ID" width="70" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" width="100" :formatter="formatRole" align="center"></el-table-column>
        <el-table-column prop="srpnames" label="所属SRP" :formatter="formatSrpname" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="修改用户" placement="top">
                <el-button size="small" icon="el-icon-edit" style=" font-size: 16px;" @click="showEditDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" v-if="scope.row.role===2 " effect="dark" content="重置密码" placement="top">
                <el-button size="small" icon="el-icon-setting" style=" font-size: 16px;" @click="showPWDDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" v-if="scope.row.role===2 " effect="dark" content="删除用户" placement="top">
                <el-button size="small" icon="el-icon-delete" style=" font-size: 16px;" @click="delUser(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total,prev, pager, next,jumper" background @current-change="handleCurrentChange" :page-size="pagesize" :current-page.sync="pageNo" :total="data.length" style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="账户ID" prop="userId">
            <el-input v-model="editForm.userId" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名" prop="userName">
            <el-input v-model="editForm.userName" maxlength="20" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="角色">
            <el-select v-model="editForm.role" placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="手机" prop="phone">
            <el-input v-model.number="editForm.phone" maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" maxlength="50" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="200" v-model="editForm.remark" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>

      <!--新增界面-->
      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" status-icon label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="用户姓名"  prop="userName">
            <el-input v-model="addForm.userName" maxlength="20" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="addForm.role" placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机"  prop="phone">
            <el-input v-model.number="addForm.phone"  maxlength="11" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" maxlength="50" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="userPwd">
            <el-input type="password"  maxlength="8" v-model="addForm.userPwd" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" maxlength="8" v-model="addForm.checkPass" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="200" v-model="addForm.remark" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog>

      <el-dialog title="密码重置" :visible.sync="pwdFormVisible" :close-on-click-modal="false">
        <el-form :model="pwdForm" label-width="100px" :rules="pwdFormRules" ref="pwdForm">
          <el-form-item label="账户ID" prop="userId">
            <el-input v-model="pwdForm.userId" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="重置密码" prop="userPwd">
            <el-input type="password" v-model="pwdForm.userPwd" maxlength="8" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="pwdForm.checkPass"  maxlength="8" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="pwdFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="pwdSubmit">提交</el-button>
        </div>
      </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_user";

export default {
  data() {
    //密码字母或数字校验
    var Mima = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z]+$/;
      if (!reg.test(value)) {
        callback(new Error("请输入字母或数字组成的密码"));
      } else {
        callback();
      }
    };
    //添加用户-手机号校验
    var CheckTel = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("电话号码必须是数字"));
      } else if (value.toString().length != 11) {
        callback(new Error("电话号码必须是11位"));
      } else {
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
      }
    };

    //修改用户-手机号校验
    var CheckTel2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入电话号码"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("电话号码必须是数字"));
      } else if (value.toString().length != 11) {
        callback(new Error("电话号码必须是11位"));
      } else if (this.usertemp.phone != value) {
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
      } else {
        callback();
      }
    };
    //添加用户-密码校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        if (this.addForm.checkPass !== "") {
          this.$refs.addForm.validateField("checkPass");
        }
        callback();
      }
    };
    //添加用户-确认密码校验
    var validatePass2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addForm.userPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //修改用户-密码校验
    var validatePass3 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        if (this.pwdForm.checkPass !== "") {
          this.$refs.pwdForm.validateField("checkPass");
        }
        callback();
      }
    };
    //修改用户-确认密码校验
    var validatePass4 = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdForm.userPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

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
      usertemp: "",
      options2: [
        {
          value: "1",
          label: "超级管理员"
        },
        {
          value: "2",
          label: "普通用户"
        }
      ],
      role: "2",
      data: [],
      datapage: [],
      total: 0,
      pageNo: 1,
      pagesize: 15,
      loading: false,
      sels: [], //列表选中列

      //密码重置相关
      pwdFormVisible: false, //界面是否显示
      pwdForm: {
        userId: "",
        userPwd: "",
        checkPass: ""
      },
      pwdFormRules: {
        userPwd: [
          {
            validator: validatePass3,
            required: true,
            trigger: "blur"
          },
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
        ],
        checkPass: [
          {
            validator: validatePass4,
            required: true,
            trigger: "blur"
          }
        ]
      },

      //编辑相关数据
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
          { max: 20, message: "最多 20 个字符", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            validator: CheckTel2,
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
      },
      addForm: {
        userName: "",
        phone: "",
        email: "",
        userPwd: "",
        checkPass: "",
        remark: "",
        role: ""
      },

      //新增相关数据
      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        userName: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { max: 20, message: "最多 20 个字符", trigger: "blur" }
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
        userPwd: [
          {
            validator: validatePass,
            required: true,
            trigger: "blur"
          },
          {
            validator: Mima,
            trigger: "blur"
          },
          {
            min: 6,
            max: 8,
            message: "请输入6至8位的密码",
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            validator: validatePass2,
            required: true,
            trigger: "blur"
          }
        ],
        remark: [{ max: 100, message: "长度小于200个字符", trigger: "blur" }]
      }
    };
  },
  methods: {
    formatRole: function(row, column) {
      return row.role == "1"
        ? "超级管理员"
        : row.role == "2" ? "普通用户" : "null";
    },
    formatSrpname: function(row, column) {
      return row.role == "1"
        ? "所有"
        : row.srpnames == "null" ? "无" : row.srpnames;
    },
    //分页按钮发生改变时触发，取出对应页数据。
    handleCurrentChange(val) {
      this.datapage = [];
      this.datapage = this.data.slice(
        (val - 1) * this.pagesize,
        val * this.pagesize
      );
    },
    //查找SRP
    search() {
      let that = this;

      that.loading = true;
      API.findList()
        .then(
          function(result) {
            that.loading = false;
            if (result && result.data) {
              that.data = result.data;
              that.datapage = that.data.slice(0, that.pagesize);
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
    },
    //多选函数
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除SRP
    delUser: function(index, row) {
      let that = this;
      var tishi = row.srpnames;
      if (tishi === "null") {
        tishi = "无";
      }
      this.$confirm(
        "该用户属于SRP:" + tishi + "。  确认删除该记录吗?",
        "提示",
        {
          type: "warning"
        }
      )
        .then(() => {
          that.loading = true;
          let param = {
            userId: row.userId
          };
          API.remove(param)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "删除成功,用户已被删除",
                    duration: 1500
                  });
                  that.search();
                  that.pageNo = 1;
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
        })
        .catch(() => {});
    },
    //显示编辑界面
    showEditDialog: function(index, row) {
      this.editFormVisible = true;
      this.usertemp = row;
      this.editForm = Object.assign({}, row);
      this.$refs["editForm"].resetFields();
    },
    //编辑
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
                  that.$refs["editForm"].resetFields();
                  that.editFormVisible = false;
                  that.search();
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
    //显示添加页面
    showAddDialog: function() {
      this.addFormVisible = true;
      this.addForm = {
        userName: "",
        phone: "",
        email: "",
        userPwd: "123456",
        checkPass: "123456",
        remark: "",
        role: "2"
      };
      this.$refs["addForm"].resetFields();
    },
    //新增
    addSubmit: function() {
      let that = this;
      this.$refs.addForm.validate(valid => {
        if (valid) {
          that.loading = true;
          console.log(this.addForm);
          API.insertProfile(this.addForm)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "新增成功",
                    duration: 3000
                  });
                  that.$refs["addForm"].resetFields();
                  that.addFormVisible = false;
                  that.search();
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
    //批量删除
    batchDeleteBook: function() {
      let ids = this.sels.map(item => item.userId).toString();
      let that = this;
      this.$confirm(
        "您选择的用户可能属于某个SRP，确认删除选中记录吗？",
        "提示",
        {
          type: "warning"
        }
      )
        .then(() => {
          that.loading = true;
          API.removeList(ids)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "删除成功",
                    duration: 3000
                  });
                  that.search();
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
        })
        .catch(() => {});
    },
    //显示密码重置弹框
    showPWDDialog: function(index, row) {
      this.pwdFormVisible = true;
      this.pwdForm = {
        userId: row.userId,
        userPwd: "",
        checkPass: ""
      };
      this.$refs["pwdForm"].resetFields();
    },
    //密码重置提交
    pwdSubmit: function() {
      let that = this;
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          this.loading = true;
          API.changePwd(this.pwdForm)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 3000
                  });
                  that.pwdFormVisible = false;
                  that.search();
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
    }
  },
  mounted() {
    this.search();
  }
};
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>