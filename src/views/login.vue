<template>
  <div class="logo">
    <img :src="img" alt="" />
  </div>

  <div class="login-inputs">
    <div class="input-labels">+86</div>
    <input type="text" v-model="form.username" placeholder="请输入手机号" />
  </div>

  <div class="login-inputs" style="border-top: none">
    <div class="input-labels">验证码</div>
    <input
      v-model="form.password"
      class="pwd-input"
      type="text"
      placeholder="请输入密码"
    />
    <div ontouchstart="" class="input-code" @click="sendCapt">
      {{ showCapt ? "获取验证码" : `${code} s` }}
    </div>
  </div>

  <div class="login-btn" @click="loginIt" ontouchstart="">登 录</div>

  <!-- <a-button type="primary" @click="messageSend">消息提醒</a-button>
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
    /> -->
  <!-- <form @submit.prevent="submitLogin">
      <input type="text" v-model="form.username" placeholder="名字" />
      <input type="password" v-model="form.password" placeholder="密码" />
      <button type="submit">提交</button>
    </form>-->
</template>

<script>
import { useRouter } from "vue-router";
import logoImg from "@/assets/logo3.png";
import { message, notification } from "ant-design-vue";
import { checkPhone } from "@/utils/util";
// import { ref, toRefs, reactive, inject } from "vue";
import { ref, toRefs, reactive, onMounted } from "vue";
import { login, getCaptcha, goCheck } from "@/api/login";
// import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
// import {setTokens} from '@/utils/util'
import { useStore } from "vuex";
export default {
  name: "Home",
  setup() {
    onMounted(() => {
      document.title = "登录";
      console.log( 'd',process.env.VUE_APP_BASE_URL)
      // message.success('d'+ process.env.BASE_URL)
    });

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
        notification.open({
          message: "错误",
          description: error,
        });
      }
    };
    let timer;
    let showCapt = ref(true);
    const sendCapt = () => {
      if (data.code > 0) return;
      if (!checkPhone(data.form.username)) {
        message.error("请正确输入手机号");
      } else {
        getCaptcha({ phone: data.form.username })
          .then(() => {
            clearInterval(timer);
            data.code = 30;
            showCapt.value = false;
            // data.form.password = res.data.code;
            timer = setInterval(() => {
              data.code--;
              if (data.code < 1) {
                clearInterval(timer);
                showCapt.value = true;
              }
            }, 1000);
          })
          .catch((err) => {
            notification.open({
              message: "错误",
              description: err.msg || "发送失败",
            });
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
          notification.open({
          message:'错误',
          description:error.msg || "错误"
        })
        }
      }
    };
    const router = useRouter();
    const toIndex = () => {
      router.push({
        path: "/index",
      });
    };
    // const msg = inject("$message");
    // const global_ = inject("_globalData");
    // const { ctx } = getCurrentInstance()
    // const messageSend = () => {
    //   console.log(global_);
    //   // console.log(ctx)
    //   msg.d = "我添加了一个d";
    //   msg.a = "reset a";

    //   msg.error("this is an error message");
    //   message.success("This is a success message");
    // };

    // const selectChange = (e) => {
    //   console.log(e);
    // };
    // const selectValue = ref("tom");

    // // 这里是日期时间选择器相关的

    // const onChange = (_, dateString) => {
    //   console.log("value, dateString", dateString);
    //   data.defaultDate = dateString;
    // };

    // const onOk = () => {
    //   console.log("数据", data.defaultDate[0], data.defaultDate[1]);
    // };
    // data.defaultDate = ["2020-10-15 11:13", "2020-12-01 11:13"];
    const img = ref("");
    img.value = logoImg;
    return {
      img,
      showCapt,
      ...toRefs(data),
      submitLogin,
      sendCapt,
      loginIt,
      // messageSend,
      // selectChange,
      // selectValue,
      // onOk,
      // onChange,
      // locale,
    };
  },
};
</script>

<style scoped>
.logo {
  padding-top: 30px;
  margin-bottom: 40px;
}
.logo img {
  width: 110px;
  object-fit: contain;
  height: 170px;
}
.input-code {
  /* display: inline-block; */
  padding: 4px 4px;
  color: #333;
  font-size: 12px;
  width: 90px;
  /* text-align: center;
  line-height: 38px; */
  border-radius: 4px;
  background: var(--green);
}
.input-code:active {
  filter: invert(0.1);
}
.pwd-input {
  width: calc(100% - 100px);
}
.input-labels {
  width: 80px;
}
.login-btn {
  width: 80%;
  font-weight: 600;
  font-size: 1.1rem;
  color: #222;
  border-radius: 5px;
  background: var(--green);
  margin-top: 5vh;
  margin-left: 10%;
  height: 50px;
  border-radius: 50px;
  line-height: 50px;
}
.login-btn:active {
  filter: invert(0.1);
}
.login-inputs {
  padding-right: 15px;
  height: 60px;
  width: calc(100% - 30px);
  margin-left: 15px;
  border: 1px solid #eee;
  background: #fff;
  display: flex;
  align-items: center;
}
</style>