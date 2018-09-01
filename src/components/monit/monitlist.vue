<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item><router-link to="/srp/list">SRP管理</router-link></el-breadcrumb-item>
        <el-breadcrumb-item>{{this.srpName}}监控项列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" v-if="this.roleid ===1" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="BackSrp">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" v-if="this.roleid ===2" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="BackSrp">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="datapage" highlight-current-row  stripe style="width: 100%;">
        <!-- <el-table-column prop="monitorId" label="监控项ID" width="60" align="center"></el-table-column> -->
        <el-table-column prop="monitorName" label="监控项名称" width="100" align="center"></el-table-column>
        <!-- <el-table-column prop="classify"   label="分类" width="80" :formatter="formatClassify" align="center"></el-table-column> -->
        <el-table-column prop="monitorType" label="监控类型" width="80" :formatter="formatMonitorType" align="center"></el-table-column>
        <el-table-column prop="requestType" label="请求类型" width="80" :formatter="formatRequestType" align="center"></el-table-column>
        <el-table-column type="expand" label="详情">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="请求地址:"> 
                <span>{{ props.row.url }}</span>
              </el-form-item>
             <br>
              <el-form-item label="请求体参数:">
                <span>{{ props.row.requestBody }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
        <el-table-column prop="asserts" label="预期正确结果"  :formatter="formatAsserts" ></el-table-column>
        <el-table-column v-if="this.roleid ===1" label="操作" align="center" width="150">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="修改监控项" placement="top">
                <el-button size="small" icon="el-icon-edit" style=" font-size: 16px;" @click="showEditDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除监控项" placement="top">
                <el-button size="small" icon="el-icon-delete" style=" font-size: 16px;" @click="delMonit(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
            <!-- <el-button @click="showMonitDialog(scope.$index,scope.row)" size="small">查看配置信息</el-button> -->
          </template>
        </el-table-column>

      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :current-page.sync="pageNo" :page-size="pagesize" :total="data.length"
          style="float:right;">
        </el-pagination>
      </el-col>

    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_monit";

export default {
  data() {
    return {
      srpId: "",
      srpName: "",
      roleid: "",
      data: [],
      datapage: [],
      pagesize: 15,
      pageNo: 1,
      loading: false
    };
  },

  methods: {
    formatClassify(row, column) {
      switch (row.classify) {
        case 1:
          return "平台登陆";
        case 2:
          return "平台接口";
        case 3:
          return "SRP登陆";
        case 4:
          return "SRP接口";
        default:
          return "null";
      }
    },
    formatMonitorType(row, column) {
      switch (row.monitorType) {
        case 1:
          return "接口";
        case 2:
          return "视频";
        case 3:
          return "页面";
        default:
          return "null";
      }
    },
    formatRequestType(row, column) {
      switch (row.requestType) {
        case 1:
          return "POST";
        case 2:
          return "GET";
        case 3:
          return "PUT";
        case 4:
          return "DELETE";
        case 5:
          return "PATCH";
        default:
          return "null";
      }
    },
    formatAsserts(row, column) {
      var params = JSON.parse(row.asserts);
      var result = "status = 200,";
      for (var i in params) {
        var result =
          result +
          params[i].akey +
          (params[i].ststus === "0"
            ? " = "
            : params[i].ststus === "1" ? "!=" : "包含") +
          params[i].value +
          ",";
      }
      return result.slice(0, -1);
    },
    handleCurrentChange(val) {
      this.datapage = [];
      this.datapage = this.data.slice(
        (val - 1) * this.pagesize,
        val * this.pagesize
      );
    },
    search() {
      let that = this;
      let params = {
        srpId: that.srpId
      };
      that.loading = true;
      API.findList(params)
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

    //删除监控项
    delMonit: function(index, row) {
      let that = this;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        that.loading = true;
        let param = {
          monitorItemId: row.monitorId
        };
        API.remove(param)
          .then(
            function(result) {
              that.loading = false;
              if (result && parseInt(result.code) === 0) {
                that.$message.success({
                  showClose: true,
                  message: "删除成功",
                  duration: 3000
                });
              }
              that.search();
              that.pageNo = 1;
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
      });
    },
    //跳转编辑界面
    showEditDialog: function(index, row) {
      this.$store.dispatch("setMonit", row).then(() => {
        this.$router.push({
          path: "/monit/monitedit"
        });
      });
    },
    //显示添加界面
    showAddDialog: function() {
      this.$router.push({
        path: "/monit/monitadd"
      });
    },
    // 显示监控项页面
    // showMonitDialog: function(index, row) {
    //   this.$store.dispatch("setSrp", row).then(() => {
    //     this.$router.push({
    //       path: "/monit/monitlist"
    //     });
    //   });
    // },
    BackSrp: function() {
      this.$router.push({
        path: "/srp/list"
      });
    },
    inti() {
      var user = JSON.parse(localStorage.getItem("USER"));
      this.roleid = user.role;
      if (this.$store.state.srp != "") {
        let srp = this.$store.state.srp;
        this.srpId = srp.srpId;
        this.srpName = srp.srpName;
      } else {
        this.$router.push({
          path: "/srp/list"
        });
        this.$message.error({
          showClose: true,
          message: "页面刷新，请重新选择SRP",
          duration: 3000
        });
      }
    }
  },
  mounted() {
    this.inti();
    this.search();
  }
};
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-table .cell {
  white-space: pre-line;
}
</style>