<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/srp/list">SRP管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link to="/monit/monitlist">监控项列表</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{this.srpName}}监控项修改</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">

      <el-tabs type="border-card">
        <el-tab-pane label="接口监控" v-if="this.monitorType === 1">

          <el-form :model="APIForm" :rules="rules" ref="APIForm" label-width="120px">
            <el-form-item label="监控项名称" prop="monitorName">
              <el-input v-model="APIForm.monitorName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
              <el-input type="textarea" v-model="APIForm.remark" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="接口所属" prop="classify">
              <el-select v-model="APIForm.classify" placeholder="请选择请求方式">
                <el-option label="平台登录" value="1"></el-option>
                <el-option label="需平台登录的接口" value="2"></el-option>
                <el-option label="SRP登录" value="3"></el-option>
                <el-option label="需SRP登录的接口" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接口地址URL" prop="url">
              <el-input v-model="APIForm.url" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="requestType">
              <el-select v-model="APIForm.requestType" placeholder="请选择请求方式">
                <el-option label="POST" :value="1"></el-option>
                <el-option label="GET" :value="2"></el-option>
                <el-option label="PUT" :value="3"></el-option>
                <el-option label="DELETE" :value="4"></el-option>
                <el-option label="PATCH" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请求体参数" prop="requestBody">
              <el-input type="textarea" autosize v-model="APIForm.requestBody" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="连接超时/秒">
              <el-select v-model="APIForm.connTimeout" placeholder="请选择">
                <el-option v-for="n in 60" :key="n" :label="n" :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="预期返回结果：">
                  <el-input v-model="this.value1" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value2" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value3" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row el-form-item v-for="(item, index) in APIForm.asserts" :key="item.key">
              <el-col :span="6">
                <el-form-item label="内容断言：" :prop="'asserts.' + index + '.akey'" :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }">
                  <el-input v-model="item.akey" maxlength="30"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px" :prop="'asserts.' + index + '.ststus'" :rules="{
      required: true, message: '不能为空', trigger: 'change'
    }">
                  <el-select v-model="item.ststus" @change="change1(item)" placeholder="比较">
                    <el-option label="等于" value="0"></el-option>
                    <el-option label="不等于" value="1"></el-option>
                     <el-option label="包含" value="2"></el-option>
                  </el-select>
                </el-form-item>

              </el-col>
              <el-col :span="5">
                <el-form-item label-width="10px" :prop="'asserts.' + index + '.value'" :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }">
                  <el-input v-model="item.value" :disabled="item.ststus==='1'" maxlength="150">
                    <template v-if="item.ststus==='1'" slot="append">默认为空</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="1">
                <el-button @click.prevent="removeItem(item)">删除</el-button>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button @click="addItem">添加断言</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitAPIForm">立即修改</el-button>
              <el-button @click="resetForm('APIForm')">重置</el-button>
              <el-button type="primary" @click="BackMonit">返回</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="前端监控" v-if="this.monitorType === 3">
          <el-form :model="PAGEForm" :rules="rules" ref="PAGEForm" label-width="120px">
            <el-form-item label="监控项名称" prop="monitorName">
              <el-input v-model="PAGEForm.monitorName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
              <el-input type="textarea" v-model="PAGEForm.remark" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="接口地址URL" prop="url">
              <el-input v-model="PAGEForm.url" maxlength="200"></el-input>
            </el-form-item>
            <el-form-item label="请求方式" prop="requestType">
              <el-select v-model="PAGEForm.requestType" placeholder="请选择请求方式">
                  <el-option label="POST" :value="1"></el-option>
                <el-option label="GET" :value="2"></el-option>
                <el-option label="PUT" :value="3"></el-option>
                <el-option label="DELETE" :value="4"></el-option>
                <el-option label="PATCH" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="连接超时/秒">
              <el-select v-model="PAGEForm.connTimeout" placeholder="请选择">
                <el-option v-for="n in 60" :key="n" :label="n" :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="预期返回结果：">
                  <el-input v-model="this.value1" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value2" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value3" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="submitPAGEForm">立即修改</el-button>
              <el-button @click="resetForm('PAGEForm')">重置</el-button>
              <el-button type="primary" @click="BackMonit">返回</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="视频监控" v-if="this.monitorType === 2">
          <el-form :model="VIDEOForm" :rules="rules" ref="VIDEOForm" label-width="120px">
            <el-form-item label="监控项名称" prop="monitorName">
              <el-input v-model="VIDEOForm.monitorName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
              <el-input type="textarea" v-model="VIDEOForm.remark" maxlength="200"></el-input>
            </el-form-item>

            <el-form-item label="视频CMS名称" prop="ivsinf">
              <el-select v-model="VIDEOForm.ivsinf" no-data-text="加载中,请稍等..." value-key="ivsid" placeholder="请选择">
                <el-option v-for="item in this.vcminf" :key="item.ivsid" :label="item.vmsname" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视频CMS编号">
              <el-input v-model="VIDEOForm.ivsinf.vcmid" disabled></el-input>
            </el-form-item>
            <el-form-item label="IVS编号">
              <el-input v-model="VIDEOForm.ivsinf.ivsid" disabled></el-input>
            </el-form-item>
            <el-form-item label="通道">
              <el-select v-model="VIDEOForm.channel" placeholder="请选择请求方式">
                <el-option v-for="n in 16" :key="n" :label="n" :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="连接超时/秒">
              <el-select v-model="VIDEOForm.connTimeout" placeholder="请选择">
                <el-option v-for="n in 60" :key="n" :label="n" :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="读取超时/秒">
              <el-select v-model="VIDEOForm.readTimeout" placeholder="请选择">
                <el-option v-for="n in 60" :key="n" :label="n" :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="6">
                <el-form-item label="预期返回结果：">
                  <el-input v-model="this.value1" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value2" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label-width="10px">
                  <el-input v-model="this.value3" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary" @click="submitVIDEOForm">立即修改</el-button>
              <el-button @click="resetForm('VIDEOForm')">重置</el-button>
              <el-button type="primary" @click="BackMonit">返回</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<script>
import API from "../../api/api_monit";

export default {
  data() {
    var isJSON = (rule, value, callback) => {
      if (value && typeof value == "string") {
        try {
          var obj = JSON.parse(value);
          if (typeof obj == "object" && obj) {
            callback();
          } else {
            callback(new Error("不是json数据"));
          }
        } catch (e) {
          callback(new Error("error：" + value + "!!!" + e));
        }
      } else {
        callback();
      }
    };
    return {
      vcminf: "",
      srpId: "",
      srpName: "",
      monitorType: "",
      loading: false,
      value1: "响应码",
      value2: "等于",
      value3: "200",
      APIForm: {
        monitorId: "",
        monitorName: "",
        remark: "",
        url: "",
        classify: "",
        requestType: "",
        requestBody: "",
        connTimeout: "20",
        readTimeout: "20",
        asserts: [
          {
            akey: "",
            ststus: "",
            value: ""
          }
        ]
      },
      PAGEForm: {
        monitorId: "",
        monitorName: "",
        remark: "",
        url: "",
        connTimeout: "20",
        readTimeout: "20",
        requestType: ""
      },
      VIDEOForm: {
        ivsinf: "",
        channel: "",
        monitorName: "",
        remark: "",
        url: "",
        classify: "4",
        requestBody: "",
        requestType: "2",
        connTimeout: "20",
        readTimeout: "20",
        value1: "响应码",
        value2: "等于",
        value3: "200"
      },
      rules: {
        classify: [
          {
            required: true,
            message: "请选择接口所属",
            trigger: "change"
          }
        ],
        monitorName: [
          {
            required: true,
            message: "请输入监控项名称",
            trigger: "blur"
          },
          {
            max: 20,
            message: "请输入最多20个字符的名称",
            trigger: "blur"
          }
        ],
        remark: [
          {
            max: 200,
            message: "请输入最多200个字符的说明",
            trigger: "blur"
          }
        ],
        url: [
          {
            required: true,
            message: "请输入URL",
            trigger: "blur"
          },
          {
            max: 200,
            message: "请输入最多200个字符的URL",
            trigger: "blur"
          }
        ],
        requestType: [
          {
            required: true,
            message: "请选择请求方式",
            trigger: "change"
          }
        ],
        requestBody: [
          {
            max: 200,
            message: "请输入最多200个字符",
            trigger: "blur"
          },
          {
            validator: isJSON,
            message: "请输入json数据",
            trigger: "blur"
          }
        ],
        ivsinf: [
          {
            required: true,
            message: "请选择视频CMS名称",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
    change1(item) {
      if (item.ststus === "1") {
        item.value = "null";
      }
    },
    BackMonit() {
      this.$router.push({
        path: "/monit/monitlist"
      });
    },
    removeItem(item) {
      var index = this.APIForm.asserts.indexOf(item);
      if (index !== -1) {
        this.APIForm.asserts.splice(index, 1);
      }
    },
    addItem() {
      this.APIForm.asserts.push({
        value: "",
        key: Date.now()
      });
    },
    submitAPIForm() {
      let that = this;
      let params = JSON.parse(JSON.stringify(this.APIForm));
      params.asserts = JSON.stringify(params.asserts);
      this.$refs.APIForm.validate(valid => {
        if (valid) {
          this.loading = true;
          API.changeMonit(params)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 3000
                  });
                  that.$router.push({
                    path: "/monit/monitlist"
                  });
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
    submitPAGEForm() {
      let that = this;
      let params = this.PAGEForm;
      this.$refs.PAGEForm.validate(valid => {
        if (valid) {
          this.loading = true;
          API.changeMonit(params)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 3000
                  });
                  that.$router.push({
                    path: "/monit/monitlist"
                  });
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
    submitVIDEOForm() {
      let that = this;
      let params = JSON.parse(JSON.stringify(this.VIDEOForm));
      if ("undefined" != typeof params.ivsinf.domain) {
        params.url =
          "http://" + params.ivsinf.domain + ":" + params.ivsinf.apiport;
      } else {
        params.url = this.VIDEOForm.url;
      }
      params.requestBody = {
        ivsid: params.ivsinf.ivsid,
        channel: params.channel,
        vcmid: params.ivsinf.vcmid
      };
      params.requestBody = JSON.stringify(params.requestBody);
      params["monitorType"] = 2;
      params["srpId"] = this.srpId;

      this.$refs.VIDEOForm.validate(valid => {
        if (valid) {
          this.loading = true;
          API.insertMonit(params)
            .then(
              function(result) {
                that.loading = false;
                if (result && parseInt(result.code) === 0) {
                  that.$message.success({
                    showClose: true,
                    message: "修改成功",
                    duration: 3000
                  });
                  that.$router.push({
                    path: "/monit/monitlist"
                  });
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
    },
    getVcm() {
      let that = this;
      API.getVCMInfoList()
        .then(
          function(result) {
            if (result && parseInt(result.code) === 0) {
              // that.$message.success({
              //   showClose: true,
              //   message: "添加成功",
              //   duration: 3000
              // });
              that.vcminf = result.data;
            } else {
              that.$message.error({
                showClose: true,
                message: "修改失败",
                duration: 3000
              });
            }
          },
          function(err) {
            that.$message.error({
              showClose: true,
              message: err.toString(),
              duration: 3000
            });
          }
        )
        .catch(function(error) {
          console.log(error);
          that.$message.error({
            showClose: true,
            message: "请求出现异常",
            duration: 3000
          });
        });
    },
    inti() {
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
          duration: 2000
        });
      }
      if (this.$store.state.monit != "") {
        let monit = this.$store.state.monit;
        this.monitorType = monit.monitorType;
        if (this.monitorType === 1) {
          monit.asserts = JSON.parse(monit.asserts);
          this.APIForm = monit;
        }
        if (this.monitorType === 2) {
          this.getVcm();
          var params = JSON.parse(monit.requestBody);
          var ivsinfini = {
            ivsid: params.ivsid,
            vcmid: params.vcmid
          };
          this.VIDEOForm.ivsinf = ivsinfini;
          this.VIDEOForm.monitorId = monit.monitorId;
          this.VIDEOForm.monitorName = monit.monitorName;
          this.VIDEOForm.remark = monit.remark;
          this.VIDEOForm.channel = params.channel;
          this.VIDEOForm.url = monit.url;
          this.VIDEOForm.connTimeout = monit.connTimeout;
          this.VIDEOForm.readTimeout = monit.readTimeout;
          console.log(monit);
        }
        if (this.monitorType === 3) {
          this.PAGEForm = monit;
        }
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
</style>