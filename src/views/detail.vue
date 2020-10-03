<template>
  <!-- <div>这是一个详情页</div> -->
  <div>
  
  <div class="rechage-title">
    储值卡号
    <span @click="showUnbind" style="float:right">...</span>
    <p>
      <span class="icon">图</span>
      {{cardNum}}

      <span style="float:right">余额:{{cardMoney || '0.00'}}</span>
    </p>
  </div>

  <div class="recharge-body">
    充值金额
    <div class="login-input">
      <span class="input-labels">￥</span>
      <input type="number" v-model="money" placeholder="充值金额" />
    </div>

    <div class="login-btn" @click="rechargeIt">充 值</div>
  </div>
  
  <div class="modal" v-if="open">
    <span class="modal-close" @click="close">x</span>
    <div class="modal-container">
      <div class="modal-title">请输入该卡号</div>
      <div class="login-input" style="height: 40px;">
        <span class="input-label">图</span>
        <input class="inputs" v-model="unbindNum" type="number" placeholder="请输入要解绑的卡号" />
      </div>
      <div class="unbind-btn" @click="unbindIt">解 绑</div>
    </div>
  </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, toRefs } from "vue";
// import { watch } from 'vue'
import { rechargeMoney, unbindCards, wxPay } from "@/api/detail.js";
import { useStore } from "vuex";
// import func from '../../vue-temp/vue-editor-bridge';
export default {
  name: "detail",
  setup() {
    const route = useRoute();
    // console.log()
    const store = useStore();
    const cardNum = ref("");
    const cardMoney = ref('0')
    let data = reactive({
      money: "",
      unbindNum: "",
    });
    cardNum.value = route.query.cardNum;
    cardMoney.value = parseFloat(route.query.money).toFixed(2);
    const wCpay = (data)=>{
      return data
      // if(!typeof WeixinJSBridge) return
      // WeixinJSBridge.invoke('getBrandWCPayRequest',{
      //     appId: data.appId, //公众号名称，由商户传入
      //     timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
      //     nonceStr: data.nonceStr, //随机串
      //     package: data.package,
      //     signType: "MD5", //微信签名方式：
      //     paySign: data.sign, //微信
      // },res=>{
      // console.log('支付回调',res.errMsg)
      // alert(res.errMsg)
      //   if (res.errMsg == "get_brand_wcpay_request:ok") {
      //       console.log("zhifu chengg ");
      //       alert('支付成功')

      //     }else{
      //       alert('支付失败')
      //     }
      // })
    }
    const rechargeIt = async () => {
      const rechargeM = parseFloat(data.money);
      if (!rechargeM || rechargeM < 0) {
        return alert("请输入正金额");
      } else {
        try {
          const params = {
            cardNum: cardNum.value,
            money: rechargeM,
          };
          let chargeR = await rechargeMoney(params);
          // console.log(chargeR);
          // console.log(store.state.openid)
          const payParam = {
            openid: store.state.openid,
            rechargeNum: chargeR.data.rechargeNum,
          };
          let payInfo = await wxPay(payParam);

          console.log(payInfo);
          wCpay(payInfo.data)
        } catch (err) {
          alert(err.msg || "充值失败");
        }

        // rechargeMoney
      }
    };
    let open = ref(false);
    const showUnbind = () => {
      open.value = true;
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      open.value = false;
      document.body.style.overflow = "";
    };
    const router = useRouter();

    const unbindIt = () => {
      if (data.unbindNum && data.unbindNum == cardNum.value) {
        unbindCards({ cardNum: data.unbindNum })
          .then(() => {
            // close();
            router.push({
              path: "/index",
            });
          })
          .catch((err) => {
            alert(err.msg || "解绑失败");
          });
      }
    };
    return {
      unbindIt,
      cardMoney,
      close,
      open,
      showUnbind,
      ...toRefs(data),
      cardNum,
      rechargeIt,
    };
  },
};
</script>

<style scoped>
.unbind-btn {
  text-align: center;
  width: calc(100% - 60px);
  border-radius: 5px;
  background: #111;
  box-shadow: 0px 6px 9px -4px #111;
  color: #fff;
  margin-top: 4vh;
  margin-left: 20px;
  height: 40px;
  line-height: 40px;
}
.inputs {
  font-size: 1rem;
  font-weight: 400;
  height: 38px;
  line-height: 38px;
  /* border: 1px solid; */
  padding: 0;
}
.login-btn {
  text-align: center;
  width: calc(100% - 60px);
  border-radius: 5px;
  background: cornflowerblue;
  box-shadow: 0px 6px 9px -4px cornflowerblue;
  color: #fff;
  margin-top: 4vh;
  margin-left: 20px;
  height: 40px;
  line-height: 40px;
}
input {
  font-size: 2rem;
  font-weight: 600;
  height: 58px;
  line-height: 58px;
  /* border: 1px solid; */
  padding: 0;
}
input::placeholder {
  /* background: transparent; */
  font-size: 0.9rem;
  color: grey;
  height: 58px;
  font-weight: 400;
}
.input-labels {
  font-size: 1.2rem;
  width: 60px;
  line-height: 60px;
  /* background: coral; */
}
.login-input {
  display: flex;
  height: 60px;
  width: calc(100% - 60px);
  margin-left: 20px;
  margin-top: 30px;
  border-bottom: 1px solid cornflowerblue;
}
.rechage-title {
  width: calc(100% - 40px);
  padding-left: 20px;
  text-align: left;
  background: #fff;
}
.rechage-title p {
  font-size: 1.1rem;
  font-weight: 300;
}
.rechage-title .icon {
  width: 30px;
  height: 30px;
  display: inline-block;
  background: lightblue;
}
.recharge-body {
  text-align: left;
  padding-top: 20px;
  margin-top: 20px;
  padding-bottom: 20px;
  /* border: 1px solid slategrey; */
}
</style>