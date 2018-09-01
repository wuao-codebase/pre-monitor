<template>
  <el-row class="warp">
     <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item > <router-link to="/">首页</router-link></el-breadcrumb-item>
        <el-breadcrumb-item>SRP管理</el-breadcrumb-item>
        <el-breadcrumb-item>SRP监控项列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <h2>{{msg}}</h2>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      msg: "SRP监控项列表"
    };
  }
};
</script>
