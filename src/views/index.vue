<template>
  <div class="card-list">
    <div class="card-title">
      会员卡（{{ list.length }}）
      <span class="add-card" @click="openAdd">添加会员卡</span>
    </div>
    <template v-if="list.length">
      <div class="card-item" v-for="i in list" :key="i.cardId">
        <div class="icon">
          <img :src="img" alt="" />
        </div>
        <div class="card-info">
          <p class="big-remark">卡号 {{ i.cardNum }}</p>
          <p class="little-card">
            余额 <span class="rechargr-amount">{{ i.cardBalance || 0 }}</span>
          </p>
        </div>
        <div class="recharge">
          <div ontouchstart="" @click="toDetail(i)" class="recharge-btn">
            充值
          </div>
        </div>
      </div>
    </template>

    <div class="card-item" style="text-align: center" v-else>
      您还没有储值卡
    </div>
    <div id="scroll-bottom"></div>
  </div>
  <div class="unbind-text">
    <span @click="clearToken"> 退出登录 </span>
  </div>
  <!-- <div class="card-btn" @click="openAdd">绑定储值卡</div> -->
  <!-- <div class="card-btn" @click="clearToken">退出</div> -->

  <a-drawer
    placement="bottom"
    :closable="false"
    height="180"
    :visible="showModal"
    :headerStyle="{
      padding: 0,
    }"
  >
    <template v-slot:title>
      <div class="modal-header">
        <div class="close" @click="close">X</div>
        <div class="title">绑定会员卡</div>
        <div class="ok" @click="bindNum">完成</div>
      </div>
    </template>
    <div class="login-input">
      <div class="input-label">卡号</div>
      <input type="text" v-model="cardNum" placeholder="请输入要绑定的卡号" />
    </div>
    <!-- <div class="login-input" style="margin-top:10px">
        <div class="input-label">备注</div>
        <input type="text" v-model="cardNum"  placeholder="请输入手机号" />
      </div> -->
  </a-drawer>
  <!-- <div class="modal" v-if="showModal">
      <span class="modal-close" @click="close">x</span>
      <div class="modal-container">
        <div class="modal-title">储值卡绑定</div>
        <div class="login-input">
          <span class="input-label">图</span>
          <input v-model="cardNum" type="text" placeholder="请输入要绑定的卡号" />
        </div>
        <div class="card-btn" @click="bindNum">绑 定</div>
      </div>
    </div> -->
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import logoImg from "@/assets/logo3.png";
import { message, notification } from "ant-design-vue";
import { isWeXin, getParams } from "@/utils/util";
// import { getParams } from "@/utils/util";
import { bindCards, getCardList, getOpenid } from "@/api/index";
import { ref, reactive, toRefs, onMounted } from "vue";
export default {
  name: "Index",
  setup() {
    let number = ref(12);
    let showModal = ref(false);
    const openAdd = () => {
      showModal.value = true;
      document.body.style.overflow = "hidden"; //隐藏滚动
    };
    const list = ref([]);
    const getList = () => {
      getCardList()
        .then((res) => {
          console.log("list", res);
          list.value = res.data;
          // notification.open({
          //   message: "dakai",
          //   description: "open",
          // });
        })
        .catch((err) => {
          notification.open({
            message: "错误",
            description: err.msg || "获取时失败，请刷新",
          });
        });
    };
    const sopce = () => {
      console.log("ok1", process.env.VUE_APP_BASE_URL);
      if (isWeXin && !store.state.openid) {
        let code = getParams("code");
        console.log("code", code);
        if (!code) {
          console.log("ok", process.env.VUE_APP_REDIRECT_URL);
          const appid = process.env.VUE_APP_APPID;
          const redirect_url = process.env.VUE_APP_REDIRECT_URL;
          let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
            redirect_url
          )}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
          console.log("url", url);
          window.location.href = url;
        } else {
          getOpenid({ code: code })
            .then((res) => {
              console.log("opendi", res);
              store.commit("setOpenid", res.data);

              return;
            })
            .catch(() => {
              setTimeout(() => {
                message.error("获取openid失败");
                sopce();
              }, 1500);
            });
        }
      } else {
        return;
      }
    };
    onMounted(() => {
      sopce();
      document.title = "储值卡";

      getList();

      // const scrollBottom = document.getElementById("scroll-bottom");
      // window.addEventListener('scroll',()=>{
      //     domPos(scrollBottom)
      // })
    });
    const close = () => {
      showModal.value = false;
      document.body.style.overflow = "";
    };
    let data = reactive({
      cardNum: "",
    });
    const bindNum = () => {
      if (data.cardNum.length > 20 || !data.cardNum) return;
      bindCards({ cardNum: data.cardNum })
        .then(() => {
          close();
          getList();
          data.cardNum = "";
        })
        .catch((err) => {
          notification.open({
            message: "错误",
            description: err.msg || "绑定失败",
          });
        });
    };
    const router = useRouter();
    const toDetail = (item) => {
      if (!item.cardNum) return;
      router.push({
        path: "/detail",
        query: { cardNum: item.cardNum.toString(), money: item.cardBalance },
      });
    };
    const store = useStore();
    const clearToken = () => {
      store.commit("setToken", "");
      router.push({
        path: "/",
      });
    };
    const img = ref("");
    img.value = logoImg;
    return {
      img,
      clearToken,
      toDetail,
      list,
      bindNum,
      ...toRefs(data),
      number,
      openAdd,
      showModal,
      close,
    };
  },
};
</script>

<style scoped>
.unbind-text {
  width: 100%;
  text-align: center;
  margin-top: 40px;
  padding-bottom: 20px;
  color: rgb(25, 104, 250);
}
.rechargr-amount {
  font-weight: 500;
  font-size: 1.3rem;
  /* filter: invert(21); */
  /* filter: hue-rotate(180deg); */
  /* color: var(--green); */
  color: #000;
}
.card-list {
  text-align: left;
  /* border: 1px dashed cornflowerblue; */
  /* width: calc(100% - 40px); */
  padding: 10px 20px;
  position: relative;
}
.add-card {
  display: inline-block;
  float: right;
  height: 40px;
  line-height: 40px;
  /* background: lightblue; */
  color: #f0621b;
  padding: 0 5px;
}
.card-title {
  font-size: 1rem;

  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
  /* background: deepskyblue; */
}
.card-del {
  position: absolute;
}
.card-item {
  overflow: hidden;
  height: 90px;
  display: flex;
  align-items: center;
  padding: 10px 5px;
  background: var(--green);
  margin-bottom: 20px;
  border-radius: 6px;
  /* display: flex; */
  color: #222;
}
.card-item .icon {
  width: 60px;
}
.card-item .card-info {
  width: calc(100% - 60px - 80px);
  /* background: deepskyblue; */
  /* display: flex; */
  /* align-items: c; */
}
.card-item .recharge {
  width: 80px;
  /* background: darkslategrey; */
}
.icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: contain;
  margin-left: 5px;
  background: #fff;
}
.big-remark {
  font-size: 1rem;
  font-weight: 400;
  margin: 0;
}
.little-card {
  font-size: 1rem;
  margin: 0;
}
.recharge-btn {
  background: #fff;
  height: 30px;
  border-radius: 30px;
  width: 70px;
  font-size: 1rem;
  text-align: center;
  line-height: 30px;
  margin: 0 auto;
}
.recharge-btn:active {
  filter: invert(0.1);
}
.modal-header {
  margin: 0;
  width: 100%;
  height: 40px;
  align-items: center;
  text-align: center;
  /* background: darkslategrey; */
  display: flex;
}
.modal-header .close {
  flex: 2;
  /* background: darkviolet; */
}

.modal-header .title {
  flex: 6;
  /* background: darkred; */
}
.modal-header .ok {
  flex: 2;
  color: #ee7131;
  /* background: gold; */
}
.card-btn {
  margin-top: 20px;
  width: calc(100% - 40px);
  margin-left: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
  border-radius: 5px;
  background: cornflowerblue;
  box-shadow: 0px 5px 13px -4px cornflowerblue;
}
</style>