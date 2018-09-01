<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户权限</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <el-table :data="tableData" :span-method="objectSpanMethod" border style="width: 100%">
        <el-table-column prop="date" label="大功能" sortable width="180" align="center" :filters="[{text: '2016-05-01', value: '2016-05-01'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2016-05-03', value: '2016-05-03'}, {text: '2016-05-04', value: '2016-05-04'}]" >
        </el-table-column>
        <el-table-column prop="name" label="小功能" width="300" align="center">
        </el-table-column>
        <el-table-column prop="address" label="超级管理员" width="100" align="center" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.address === '有' ? 'primary' : 'success'" disable-transitions>{{scope.row.address}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="普通用户" width="100" align="center" >
          <template slot-scope="scope">
            <el-tag :type="scope.row.tag === '有' ? 'primary' : 'success'" disable-transitions>{{scope.row.tag}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "监控报告",
          name: "监控结果总览",
          address: "有",
          tag: "有"
        },
        {
          date: "监控报告",
          name: "详细监控信息",
          address: "有",
          tag: "有"
        },
        {
          date: "账户管理",
          name: "账户新建/编辑/删除（账户依着角色添加）",
          address: "有",
          tag: "无"
        },
        {
          date: "账户管理",
          name: "账户密码编辑",
          address: "有",
          tag: "有"
        },
        {
          date: "账户管理",
          name: "账户信息显示",
          address: "有",
          tag: "有"
        },
        {
          date: "账户管理",
          name: "权限列表：列出各个角色权限",
          address: "有",
          tag: "有"
        },
        {
          date: "账户管理",
          name: "微信通知信息设置",
          address: "有",
          tag: "无"
        },
        {
          date: "账户管理",
          name: "微信消息接受者列表",
          address: "有",
          tag: "有"
        },
        {
          date: "SRP管理",
          name: "SRP查看",
          address: "有",
          tag: "有"
        },
        {
          date: "SRP管理",
          name: "SRP下监控项查看",
          address: "有",
          tag: "有"
        },
        {
          date: "SRP管理",
          name: "SRP新建/编辑/删除",
          address: "有",
          tag: "无"
        },
        {
          date: "SRP管理",
          name: "SRP监控项新建/编辑/删除",
          address: "有",
          tag: "无"
        },
        {
          date: "SRP管理",
          name: "预期返回结果设定",
          address: "有",
          tag: "无"
        },
        {
          date: "SRP管理",
          name: "监控频率设定",
          address: "有",
          tag: "无"
        },
        {
          date: "SRP管理",
          name: "开启、关闭设定",
          address: "有",
          tag: "无"
        }
      ]
    };
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  }
};
</script>
