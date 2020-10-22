<template>
  <div class="login-bg">
    <div class="login-title">登录</div>
    <div class="login-input">
      <span class="input-label">图</span>
      <input type="text" v-model="form.username" placeholder="请输入手机号" />
    </div>

    <div class="login-input">
      <span class="input-label">图</span>
      <input
        v-model="form.password"
        class="pwd-input"
        type="text"
        placeholder="请输入密码"
      />
      <span class="input-code" @click="sendCapt">{{
        showCapt ? "获取验证码" : `${code} s`
      }}</span>
    </div>

    <div class="login-btn" @click="loginIt">登 录</div>

    <a-button type="primary" @click="messageSend">消息提醒</a-button>
    <div>
      <a-select
        v-model:value="selectValue"
        @change="selectChange"
        style="width: 300px"
      >
        <a-select-option value="lucy">lucy</a-select-option>
        <a-select-option value="jack">jack</a-select-option>
        <a-select-option value="tom">tom</a-select-option>
        <a-select-option value="shely">shely</a-select-option>
      </a-select>
    </div>

    <a-range-picker
      :show-time="{ format: 'HH:mm' }"
      format="YYYY-MM-DD HH:mm"
      :placeholder="['Start Time', 'End Time']"
      :locale="locale"
      v-model:value="defaultDate"
      @change="onChange"
      @ok="onOk"
    />
    <!-- <form @submit.prevent="submitLogin">
      <input type="text" v-model="form.username" placeholder="名字" />
      <input type="password" v-model="form.password" placeholder="密码" />
      <button type="submit">提交</button>
    </form>-->
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { checkPhone } from "@/utils/util";
import { ref, toRefs, reactive, inject } from "vue";
import { login, getCaptcha, goCheck } from "@/api/login";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
// import {setTokens} from '@/utils/util'
import { useStore } from "vuex";
export default {
  name: "Home",
  setup() {
    let data = reactive({
      form: {
        username: "",
        password: "",
      },
      code: 0,
    });

    const store = useStore();
    const submitLogin = async () => {
      try {
        let res = await login(data.form);
        console.log(res);
        store.commit("setToken", res.token);
        // let info = await getInfo()
        // console.log('info',info)
        // setTokens(res.msg)
      } catch (error) {
        console.log("失败", error);
      }
    };
    let timer;
    let showCapt = ref(true);
    const sendCapt = () => {
      if (data.code > 0) return;
      if (!checkPhone(data.form.username)) {
        alert("请输入手机号");
      } else {
        getCaptcha({ phone: data.form.username })
          .then((res) => {
            clearInterval(timer);
            data.code = 30;
            showCapt.value = false;
            data.form.password = res.data.code;
            timer = setInterval(() => {
              data.code--;
              if (data.code < 1) {
                clearInterval(timer);
                showCapt.value = true;
              }
            }, 1000);
          })
          .catch((err) => {
            alert(err.msg || "错误");
          });
      }
    };

    const loginIt = async () => {
      if (data.form.username && data.form.password) {
        try {
          let checkRes = await goCheck({
            code: data.form.password,
            phone: data.form.username,
          });
          console.log(checkRes);
          store.commit("setToken", checkRes.data.token);
          toIndex();
        } catch (error) {
          console.log(error);
          alert(error.msg || "发生了点错误");
        }
      }
    };
    const router = useRouter();
    const toIndex = () => {
      router.push({
        path: "/index",
      });
    };
    const msg = inject("$message");
    const global_ = inject("_globalData");
    // const { ctx } = getCurrentInstance()
    const messageSend = () => {
      console.log(global_);
      // console.log(ctx)
      msg.d = "我添加了一个d";
      msg.a = "reset a";

      msg.error("this is an error message");    
      message.success("This is a success message");
    };

    const selectChange = (e) => {
      console.log(e);
    };
    const selectValue = ref("tom");

    // 这里是日期时间选择器相关的

    const onChange = (_, dateString) => {
      console.log("value, dateString", dateString);
      data.defaultDate = dateString;
    };

    const onOk = () => {
      console.log("数据", data.defaultDate[0], data.defaultDate[1]);
    };
    data.defaultDate = ["2020-10-15 11:13", "2020-12-01 11:13"];

    return {
      showCapt,
      ...toRefs(data),
      submitLogin,
      sendCapt,
      loginIt,
      messageSend,
      selectChange,
      selectValue,
      onOk,
      onChange,
      locale,
    };
  },
};
</script>

<style scoped>
.input-code {
  font-size: 12px;
  width: 118px;
  text-align: center;
  line-height: 38px;
}
.pwd-input {
  width: calc(100% - 130px);
}
.login-bg {
}
.login-btn {
  width: calc(100% - 40px);
  border-radius: 5px;
  background: cornflowerblue;
  box-shadow: 0px 6px 9px -4px cornflowerblue;
  color: #fff;
  margin-top: 4vh;
  margin-left: 20px;
  height: 40px;
  line-height: 40px;
}
.login-title {
  font-size: 20px;
  margin-left: 20px;
  font-weight: 500;
  margin-top: 100px;
}
</style>