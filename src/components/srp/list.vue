<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>SRP管理</el-breadcrumb-item>
        <el-breadcrumb-item>SRP列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" v-if="this.roleid ===1" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="datapage" highlight-current-row @selection-change="selsChange" stripe style="width: 100%;">
        <el-table-column prop="srpId" label="SRPID" width="100" align="center"></el-table-column>
        <el-table-column prop="srpName" label="SRP名称" width="150" align="center"></el-table-column>
        <el-table-column prop="description" label="说明" align="center"></el-table-column>
        <el-table-column prop="freq" label="测试频率/分钟" width="150" align="center"></el-table-column>
        <el-table-column label="开关" width="150" align="center">
          <template slot-scope="props">
            <el-switch disabled v-model="props.row.switchs" active-color="#13ce66" inactive-color="#ff4949" :active-value="true" :inactive-value="false">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column v-if="this.roleid ===1" label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="修改SRP" placement="top">
                <el-button size="small" icon="el-icon-edit" style=" font-size: 16px;" @click="showEditDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除SRP" placement="top">
                <el-button size="small" icon="el-icon-delete" style=" font-size: 16px;" @click="delSrp(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="监控项查看" placement="top">
                <el-button size="small" icon="el-icon-search" style=" font-size: 16px;" @click="showMonitDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column v-if="this.roleid ===2" label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="dark" content="查看接受者列表" placement="top">
                <el-button size="small" icon="el-icon-edit" style=" font-size: 16px;" @click="showEditDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="监控项查看" placement="top">
                <el-button size="small" icon="el-icon-search" style=" font-size: 16px;" @click="showMonitDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange"  :current-page.sync="pageNo" :page-size="pagesize" :total="data.length"
          style="float:right;">
        </el-pagination>
      </el-col>

    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_srp";

export default {
  data() {
    return {
      roleid: "",
      data: [],
      datapage: [],
      total: 0,
      pageNo: 1,
      pagesize: 15,
      loading: false,
      sels: [] //列表选中列
    };
  },

  methods: {
    handleCurrentChange(val) {
      this.datapage = [];
      this.datapage = this.data.slice(
        (val - 1) * this.pagesize,
        val * this.pagesize
      );
    },
    search() {
      let that = this;
      that.loading = true;
      var USER = localStorage.getItem("USER");
      API.findList(JSON.parse(USER))
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
    selsChange: function(sels) {
      this.sels = sels;
    },
    //删除
    delSrp: function(index, row) {
      let that = this;
      this.$confirm(
        "删除SRP会一同删除其所属的“接受者列表”和“监控项列表”，确认删除该记录吗?",
        "提示",
        {
          type: "warning"
        }
      )
        .then(() => {
          that.loading = true;
          let param = {
            srpId: row.srpId
          };
          API.remove(param)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "删除成功",
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
        })
        .catch(() => {});
    },
    //跳转编辑界面
    showEditDialog: function(index, row) {
      this.$store.dispatch("setSrp", row).then(() => {
        this.$router.push({
          path: "/srp/listedit"
        });
      });
    },
    //显示添加界面
    showAddDialog: function() {
      this.$store.dispatch("setSrp", "").then(() => {
        this.$router.push({
          path: "/srp/listadd"
        });
      });
    },
    //显示监控项页面
    showMonitDialog: function(index, row) {
      this.$store.dispatch("setSrp", row).then(() => {
        this.$router.push({
          path: "/monit/monitlist"
        });
      });
    },

    inti() {
      var user = JSON.parse(localStorage.getItem("USER"));
      this.roleid = user.role;
    }
  },
  mounted() {
    this.search();
    this.inti();
  }
};
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>