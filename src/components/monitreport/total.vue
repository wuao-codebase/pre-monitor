<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>监控报告 </el-breadcrumb-item>
        <el-breadcrumb-item>监控报告总览</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item label="SRP名称：">
            <el-select v-model="filters.srpId"  no-data-text="加载中,请稍等..." clearable filterable placeholder="请选择">
              <el-option v-for="item in srpList" :key="item.srpId" :label="item.srpName" :value="item.srpId">
              </el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="结果" prop="requestType">
              <el-select v-model="filters.errorCount" placeholder="所有" clearable style="width:100px;">
                <el-option label="仅成功" value="1"></el-option>
                <el-option label="仅失败" value="2"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <div class="block">
              <span class="demonstration">时间：</span>
              <el-date-picker  v-model="dateRange" type="datetimerange"  :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" align="right">
              </el-date-picker>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>

        </el-form>
      </el-col>
      <!--列表-->
       <el-table :data="data" highlight-current-row  style="width: 100%;">
        <!-- <el-table-column prop="srpId" label="SRPID" width="100" align="center"></el-table-column> -->
        <el-table-column prop="srpName" label="SRP名称" width="150" align="center"></el-table-column>
        <el-table-column prop="monitorNum" label="监控项总数"  width="100" align="center"></el-table-column>
        <el-table-column prop="successCount" :formatter="successformat"  label="成功数" width="80" align="center"></el-table-column>
        <el-table-column label="失败数" width="80" align="center">
           <template slot-scope="scope">
        <el-tag
          :type="scope.row.errorCount === 0 ? 'success' : 'warning'"
          disable-transitions>{{scope.row.errorCount}}</el-tag>
      </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间"  align="center"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"  align="center"></el-table-column>

        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="scope">
             <el-tooltip class="item" effect="dark" content="详细故障信息" placement="top">
                <el-button size="small" icon="el-icon-search"  @click="showDetailDialog(scope.$index,scope.row)"></el-button>
              </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination layout="total,prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="pagesize" :total="this.total"
          style="float:right;">
        </el-pagination>
      </el-col>

    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_report";

export default {
  data() {
    return {
      filters: {
        srpId: "",
        errorCount: "",
        startTime: "",
        endTime: ""
      },
      dateRange: "",
      srpId: "",
      role: "",
      userId: "",
      data: [],
      srpList: [],
      total: 0,
      page: 1,
      pagesize: 15,
      loading: false,
      pickerOptions2: {
        shortcuts: [
          {
            text: "一天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "三天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "一个星期内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },

  methods: {
    successformat(row, column) {
      return row.monitorNum - row.errorCount;
    },
    dateFormat: function(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },

    handleCurrentChange(val) {
      this.page = val;
      this.search();
    },
    handleSearch() {
      this.total = 0;
      this.page = 1;
      this.search();
    },
    SrpList() {
      let that = this;
      that.loading = true;
      API.findSrpList(JSON.parse(localStorage.getItem("USER")))
        .then(
          function(result) {
            that.loading = false;
            if (result && result.data) {
              that.srpList = result.data;
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
            message: "下拉列表请求出现异常",
            duration: 2000
          });
        });
    },
    search() {
      let that = this;

      if (that.dateRange != null && that.dateRange[0] != null) {
        that.filters.startTime = that.dateFormat(that.dateRange[0]);
        that.filters.endTime = that.dateFormat(that.dateRange[1]);
      } else {
        that.filters.startTime = "";
        that.filters.endTime = "";
      }
      let params = {
        pageNo: that.page,
        role: that.role,
        userId: that.userId,
        totalReport: that.filters
      };

      that.loading = true;
      API.findTOList(params)
        .then(
          function(result) {
            that.loading = false;
            if (result && result.data) {
              that.data = result.data.data;
              that.total = result.data.total;
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

    //显示监控项页面
    showDetailDialog: function(index, row) {
      this.$store.dispatch("setReport", row).then(() => {
        this.$router.push({
          path: "/monitreport/detailed"
        });
      });
    },

    inti() {
      var user = JSON.parse(localStorage.getItem("USER"));
      this.role = user.role;
      this.userId = user.userId;
    }
  },
  mounted() {
    this.inti();
    this.SrpList();
    this.search();
  }
};
</script>

<style>
.demo-table-expand label {
  font-weight: bold;
}
</style>