<template>
  <div class="login-bg">
    <div class="login-title">登录</div>
    <div class="login-input">
      <span class="input-label">图</span>
      <input type="text" v-model="form.username" placeholder="请输入手机号" />
    </div>

    <div class="login-input">
      <span class="input-label">图</span>
      <input v-model="form.password" class="pwd-input" type="text" placeholder="请输入密码" />
      <span class="input-code" @click="sendCapt">{{showCapt?'获取验证码':`${code} s`}}</span>
    </div>

    <div class="login-btn" @click="loginIt">登 录</div>

    <!-- <form @submit.prevent="submitLogin">
      <input type="text" v-model="form.username" placeholder="名字" />
      <input type="password" v-model="form.password" placeholder="密码" />
      <button type="submit">提交</button>
    </form>-->
  </div>
</template>

<script>
import {useRouter} from 'vue-router'
import { checkPhone } from "@/utils/util";
import { ref, toRefs, reactive } from "vue";
import { login, getCaptcha, goCheck } from "@/api/login";
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
        alert("错误");
      } else {
        getCaptcha({ phone: data.form.username })
          .then(() => {
            data.code = 30;
            showCapt.value = false;
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
            toIndex()
        } catch (error) {
          console.log(error)
          alert(error.msg || "发生了点错误");
        }
      }
    };
    const router = useRouter()
    const toIndex = ()=>{
        
        router.push({
            path:'/index'
        })
    }
    return { showCapt, ...toRefs(data), submitLogin, sendCapt, loginIt };
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