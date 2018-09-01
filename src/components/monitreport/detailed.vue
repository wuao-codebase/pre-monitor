<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item> 监控报告</el-breadcrumb-item>
        <el-breadcrumb-item> <router-link to="/monitreport/total">监控报告总览</router-link></el-breadcrumb-item>
        <el-breadcrumb-item>详细监控报告</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-button type="primary" @click="BackList">返回</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!--列表-->
      <el-table :data="datapage"     :row-class-name="tableRowClassName" style="width: 100%;">
        <el-table-column prop="monitorName" label="监控项名称"  width="120"  align="center"></el-table-column>
        <el-table-column prop="monitorType" label="监控项类型" :formatter="formatMonitorType" width="100" align="center"></el-table-column>
        <el-table-column prop="code" :formatter="codeformat"  width="100" label="测试状态" align="center"></el-table-column>
        <el-table-column label="错误信息" align="center">
          <template slot-scope="scope">
            <span style="white-space: pre-line;"  v-html="scope.row.message" ></span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="时间" width="150" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
              <el-button-group>
                <el-button size="small" icon="el-icon-document"  @click="showResultDialog(scope.$index,scope.row)">返回结果</el-button>
                <el-button size="small" icon="el-icon-setting" @click="showMonitDialog(scope.$index,scope.row)">配置信息</el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="pagesize" :total="data.length"
          style="float:right;">
        </el-pagination>
      </el-col>
      <el-dialog title="返回结果" :visible.sync="FormVisible" :close-on-click-modal="false">
        <el-form label-position="left" :v-model="monit" inline label-width="150px" ref="monit" class="demo-table-expand">
          <el-form-item label="监控项名称：">
            <span>{{ monit.monitorName }}</span>
          </el-form-item>
          <el-form-item label="监控项类型：">
            <span>{{ monit.monitorType }}</span>
          </el-form-item>
          <el-form-item label="请求类型">
            <span>{{ monit.requestType}}</span>
          </el-form-item>
          <el-form-item v-if="monit.monitorType!='视频'" label="url：">
            <span >{{ monit.url }}</span>
          </el-form-item>
          <el-form-item label="请求体参数：">
            <pre >{{ monit.requestBody |json}}</pre>
          </el-form-item>
          <el-form-item label="断言：">
            <span>{{ monit.asserts }}</span>
          </el-form-item>
            <el-form-item label="连接超时/秒：">
            <span>{{ monit.connTimeout }}</span>
          </el-form-item>
          <el-form-item label="读取超时/秒：">
            <span>{{monit.readTimeout }}</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="FormVisible = false">取消</el-button>
        </div>
      </el-dialog>

<el-dialog title="监控项配置"  :visible.sync="ResultVisible" :close-on-click-modal="false">
    <pre>{{ this.ResultMessg}}</pre>
     <div slot="footer" class="dialog-footer">
          <el-button @click.native="ResultVisible = false">取消</el-button>
        </div>
    </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_report";

export default {
  data() {
    return {
      FormVisible: false,
      ResultVisible: false,
      ResultMessg: "",
      uuid: "",
      data: [],
      monit: "",
      datapage: [],
      total: 0,
      page: 1,
      pagesize: 15,
      loading: false,
      sels: [] //列表选中列
    };
  },

  methods: {
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
    tableRowClassName({ row, rowIndex }) {
      if (row.code === false) {
        return "warning-row";
      } else if (row.code === true) {
        return "";
      }
      return "";
    },

    codeformat(row, column) {
      return row.code === true ? "成功" : "失败";
    },
    showResultDialog(index, row) {
      this.ResultMessg = "";
      this.ResultVisible = true;
      try {
        var obj = JSON.parse(row.messageBody);
        if (typeof obj == "object" && obj) {
          this.ResultMessg = JSON.stringify(obj, null, 4);
        } else {
          this.ResultMessg = row.messageBody;
        }
      } catch (e) {
        this.ResultMessg = row.messageBody;
      }
    },

    showMonitDialog: function(index, row) {
      this.FormVisible = true;
      let that = this;
      API.findmonit(row.monitorId)
        .then(
          function(result) {
            if (result && result.data) {
              that.monit = result.data;
              switch (that.monit.monitorType) {
                case 1:
                  that.monit.monitorType = "接口";
                  break;
                case 2:
                  that.monit.monitorType = "视频";
                  break;
                case 3:
                  that.monit.monitorType = "页面";
                  break;
                default:
                  that.monit.monitorType = "null";
              }
              switch (that.monit.requestType) {
                case 1:
                  that.monit.requestType = "POST";
                  break;
                case 2:
                  that.monit.requestType = "GET";
                  break;
                case 3:
                  that.monit.requestType = "PUT";
                  break;
                case 4:
                  that.monit.requestType = "DELETE";
                  break;
                case 5:
                  that.monit.requestType = "PATCH";
                  break;
                default:
                  that.monit.requestType = "null";
                  break;
              }
              var params = JSON.parse(that.monit.asserts);
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
              that.monit.asserts = String(result).slice(0, -1);
              if (String(that.monit.requestBody).length > 0) {
                that.monit.requestBody = JSON.parse(that.monit.requestBody);
              }
            }
          },
          function(err) {
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 2000
            });
          }
        )
        .catch(function(error) {
          console.log(error);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 2000
          });
        });
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
      that.loading = true;
      API.findDetailList(this.uuid)
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

    //返回
    BackList: function(index, row) {
      this.$router.push({
        path: "/monitreport/total"
      });
    },

    inti() {
      if (this.$store.state.report != "") {
        this.uuid = this.$store.state.report.uuid;
        this.search();
      } else {
        this.$router.push({
          path: "/monitreport/total"
        });
        this.$message.error({
          showClose: true,
          message: "页面刷新，请重新选择",
          duration: 2000
        });
      }
    }
  },
  mounted() {
    this.inti();
  }
};
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
pre {
  max-height: 500px;
  overflow: auto;
  /* white-space: pre-wrap;
  white-space: -moz-pre-wrap; 
  white-space: -pre-wrap;
  white-space: -o-pre-wrap; 
  word-wrap: break-word; */
}
</style>