<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>SRP管理</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/srp/list">SRP列表</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>SRP添加</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-main"  v-loading="loading" element-loading-text="拼命加载中">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item>
          <el-button type="primary" @click="goSrp" style="float:right; margin:0px 0px 0px 20px;">返回</el-button>
          <el-button @click="resetForm('ruleForm')" style="float:right; margin:0px 0px 0px 20px;">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" style="float:right; margin:0px 0px 0px 20px;">确定</el-button>
        </el-form-item>
        <el-form-item label="SRP名称" prop="srpName">
          <el-input v-model="ruleForm.srpName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="description">
          <el-input type="textarea" v-model="ruleForm.description" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="开始监控" prop="switchs">
          <el-switch v-model="ruleForm.switchs" active-text="是" inactive-text="否" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-form-item label="监控频率/分钟" prop="freq">
          <el-time-select @change="getSTime" v-model="ruleForm.freq" :picker-options="{
          start: '00:30',
          step: '00:30',
          end: '24:00'
          }" placeholder="选择时间">
          </el-time-select>
        </el-form-item>
      </el-form>
      <br>

      <h4>接受者列表</h4>
      <hr style="width:100%;
        margin:0 auto;
        border: 0;
        height: 1px;
        background: #333;
        background-image: linear-gradient(to right, #ccc, #333, #ccc);">

      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!-- 接受者列表 -->
      <el-table :data="datapage" highlight-current-row stripe style="width: 100%;">
        <el-table-column prop="userId" label="账户ID" width="70" align="center"></el-table-column>
        <el-table-column prop="userName" label="姓名" width="100" align="center"></el-table-column>
        <el-table-column prop="role" label="角色" width="100" :formatter="formatRole" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button type="danger" @click="delSrpser(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--新增界面-->

      <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
        <el-button type="primary" @click="adduserlist" :disabled="this.sels.length===0" style="float:right">全部添加</el-button>
        <el-table :data="adddata" highlight-current-row stripe style="width: 100%; " @selection-change="selsChange" height="500">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userId" label="账户ID" width="70"></el-table-column>
          <el-table-column prop="userName" label="用户姓名" width="100"></el-table-column>
          <el-table-column prop="role" label="角色" :formatter="formatRole" width="100"></el-table-column>
          <el-table-column prop="phone" label="手机号："></el-table-column>
          <el-table-column prop="srpnames" label="所属SRP" :formatter="formatSrpname"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_srp";

export default {
  data() {
    return {
      data: [],
      datapage: [],
      page: 1,
      pagesize: 10,
      loading: false,
      sels: [], //列表选中列
      ruleForm: {
        srpName: "",
        description: "",
        freq: "",
        switchs: false
      },
      rules: {
        srpName: [
          {
            required: true,
            message: "请输入SRP名称",
            trigger: "blur"
          },
          {
            max: 20,
            message: "请输入最多20个字符的名称",
            trigger: "blur"
          }
        ],
        description: [
          {
            max: 200,
            message: "请输入最多200个字符的描述",
            trigger: "blur"
          }
        ],
        freq: [
          {
            required: true,
            message: "请选择时间",
            trigger: "blur"
          }
        ]
      },
      //新增相关数据
      adddata: [],
      addFormVisible: false, //新增界面是否显示
      addLoading: false
    };
  },
  methods: {
    selsChange: function(sels) {
      this.sels = sels;
    },
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

    getSTime(val) {
      var vals = val.split(":");
      this.ruleForm.freq = vals[0] * 60 + vals[1] * 1;
    },
    //SRP添加
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //增加SRP
          let that = this;
          var ids = that.datapage.map(item => item.userId).toString();
          if (ids.length < 1) {
            that.$message.error({
              showClose: true,
              message: "请添加接受者",
              duration: 3000
            });
            return;
          }
          var params = {
            srp: this.ruleForm,
            ids: ids
          };
          console.log(params);
          that.loading = true;
          API.insertSrp(params)
            .then(
              function(result) {
                that.loading = false;
                if (result && result.data) {
                  that.$message.success({
                    showClose: true,
                    message: "增加成功，自动返回SRP列表请查看",
                    duration: 2000
                  });
                  that.$router.push({ path: "/srp/list" });
                }
              },
              function(err) {
                that.loading = false;
                that.$message.error({
                  showClose: true,
                  message: err.toString(),
                  duration: 2000
                });
              }
            )
            .catch(function(error) {
              that.loading = false;
              console.log(error);
              that.$message.error({
                showClose: true,
                message: "请求出现异常",
                duration: 2000
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goSrp: function(index, row) {
      this.$router.push({
        path: "/srp/list"
      });
    },

    showAddDialog: function() {
      this.addFormVisible = true;
      this.searchuser();
    },
    //查找普通用户
    searchuser() {
      let that = this;
      that.loading = true;
      API.findadduse()
        .then(
          function(result) {
            that.loading = false;
            if (result && result.data) {
              var adddata1 = result.data.filter(function(item) {
                for (var i in that.datapage) {
                  var boole =
                    that.datapage[i].userId === item.userId ? true : false;
                  if (boole) {
                    return false;
                  }
                }
                return true;
              });
              that.adddata = adddata1.filter(function(item) {
                return item.role === 2;
              });
            }
          },
          function(err) {
            that.loading = false;
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 2000
            });
          }
        )
        .catch(function(error) {
          that.loading = false;
          console.log(error);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
        });
    },

    adduserlist: function() {
      let that = this;
      that.datapage = Array.from(new Set(that.datapage.concat(that.sels)));
      this.addFormVisible = false;
    },

    //删除
    delSrpser: function(index, row) {
      let that = this;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          that.datapage.splice(index, 1);
        })
        .catch(() => {});
    }
  }
};
</script>