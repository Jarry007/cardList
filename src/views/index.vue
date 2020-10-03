<template>
  <div>
    <div class="card-list">
      <div class="card-title">
        会员卡
        <span style="float:right">全部 {{number}}</span>
      </div>
      <template v-if="list.length">
        <div @click="toDetail(i)" class="card-item" v-for="i in list" :key="i.cardId">
          <span class="label">碾米储值卡</span>
          <span class="num">{{i.cardNum}}</span>
        </div>
        <!-- <div class="card-item" v-for="i in 6" :key="i">
        <span class="label">碾米储值卡</span>
        <span class="num">{{i}}</span>
        </div>-->
      </template>

      <div class="card-item" style=" text-align: center;" v-else>您还没有储值卡</div>
      <div id="scroll-bottom"></div>
    </div>

    <div class="card-btn" @click="openAdd">绑定储值卡</div>
    <div class="card-btn" @click="clearToken">qingk</div>

    <div class="modal" v-if="showModal">
      <span class="modal-close" @click="close">x</span>
      <div class="modal-container">
        <div class="modal-title">储值卡绑定</div>
        <div class="login-input">
          <span class="input-label">图</span>
          <input v-model="cardNum" type="text" placeholder="请输入要绑定的卡号" />
        </div>
        <div class="card-btn" @click="bindNum">绑 定</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
// import { getParams } from "@/utils/util";
import { bindCards, getCardList } from "@/api/index";
import { ref, reactive, toRefs, onMounted } from "vue";
export default {
  name: "Index",
  setup() {
    let number = ref(12);
    let showModal = ref(false);
    const openAdd = () => {
      showModal.value = true;
      document.body.style.overflow = "hidden"; //隐藏滚动条
    };
    const list = ref([]);
    const getList = () => {
      getCardList()
        .then(res => {
          console.log("list", res);
          list.value = res.data;
        }) 
        .catch(err => {
          alert(err.msg || "获取时失败，请刷新");
        });
    };
    // const sopce = () => {
    //   if (isWeXin && !store.state.openid) {
    //     let code = getParams("code");
    //     console.log(code);
    //     if (!code) {
    //       console.log("ok");
    //       const appid = process.env.VUE_APP_APPID;
    //       const redirect_url = process.env.REDIRECT_URL;
    //       let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
    //         redirect_url
    //       )}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
    //       window.location.href = url;
    //     } else {
    //       getOpenid({ code: code })
    //         .then(res => {
    //           console.log("opendi", res);
    //           store.commit("setOpenid", res.data);

    //           return;
    //         })
    //         .catch(() => {
    //           sopce();
    //         });
    //     }
    //   } else {
    //     return;
    //   }
    // };
    onMounted(() => {
      // sopce();
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
      cardNum: ""
    });
    const bindNum = () => {
      if (data.cardNum.length > 20 || !data.cardNum) return;
      bindCards({ cardNum: data.cardNum })
        .then(() => {
          close();
          getList();
          data.cardNum = "";
        })
        .catch(err => {
          alert(err.msg || "绑定失败");
        });
    };
    const router = useRouter();
    const toDetail = item => {
      if (!item.cardNum) return;
      router.push({
        path: "/detail",
        query: { cardNum: item.cardNum.toString(), money: item.cardBalance }
      });
    };
    const store = useStore();
    const clearToken = () => {
      store.commit("setToken", "");
    };
    return {
      clearToken,
      toDetail,
      list,
      bindNum,
      ...toRefs(data),
      number,
      openAdd,
      showModal,
      close
    };
  }
};
</script>

<style scoped>
.card-list {
  text-align: left;
  /* border: 1px dashed cornflowerblue; */
  width: calc(100% - 40px);
  padding: 10px 20px;
  position: relative;
}
.card-title {
  margin-bottom: 10px;
}
.card-del {
  position: absolute;
}
.card-item {
  overflow: hidden;
  height: 80px;
  width: calc(100% - 20px);
  background: lightcoral;
  padding: 0 10px;
  margin-bottom: 20px;
  position: relative;
  border-radius: 4px;
  /* display: flex; */
  color: #fff;
  line-height: 80px;
}
.card-item .label {
}
.card-item .num {
  float: right;
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