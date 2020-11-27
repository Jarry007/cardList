<template>
  <div class="rechage-title">
    余额 <span class="amount-money">{{ cardMoney || "0.00" }}</span> 元
  </div>

  <div class="recharge-body">
    <div class="ic-num">
      IC卡号 <span class="amount-money"> {{ cardNum }}</span>
    </div>

    <div class="meal-body">
      <div class="meal" :class="{ active: i === 2 }" v-for="i in 5" :key="i">
        <span class="" style="font-size: 14px; font-weight: 400">￥</span
        >{{ i }}
        <div class="light-text">售价{{ i + 100 }}元</div>
      </div>
      <div class="meal-input">
        <input type="number" v-model="money" placeholder="自定义" />
      </div>
    </div>
    <div ontouchstart="" class="login-btn" @click="rechargeIt">充 值</div>

    <div class="unbind-text">
      <a-popconfirm
        @confirm="unbindIt"
        title="您确定解绑该卡？"
        ok-text="确认"
        cancel-text="取消"
      >
        <span>解绑会员卡</span>
      </a-popconfirm>
    </div>
  </div>

  <a-modal v-model:visible="open" title="解绑">
    <p>您确定解绑该卡？</p>
  </a-modal>
  <!-- <div class="modal" v-if="open">
    <span class="modal-close" @click="close">x</span>
    <div class="modal-container">
      <div class="modal-title">请输入该卡号</div>
      <div class="login-input" style="height: 40px;">
        <span class="input-label">图</span>
        <input class="inputs" v-model="unbindNum" type="number" placeholder="请输入要解绑的卡号" />
      </div>
      <div class="unbind-btn" @click="unbindIt">解 绑</div>
    </div>
  </div> -->
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, toRefs } from "vue";
// import { watch } from 'vue'
import { message } from "ant-design-vue";
import { rechargeMoney, unbindCards, wxPay } from "@/api/detail.js";
import { useStore } from "vuex";
// import func from '../../vue-temp/vue-editor-bridge';
export default {
  name: "detail",
  setup() {
     const store = useStore();
    const route = useRoute();
    const cardNum = ref("");
    const cardMoney = ref("0");
    let data = reactive({
      money: "",
      unbindNum: "",
    });
    cardNum.value = route.query.cardNum;
    cardMoney.value =parseFloat(route.query.money)?  parseFloat(route.query.money).toFixed(2):0 ;
    const wxJsBridge = window.WeixinJSBridge;
    if (wxJsBridge) {
      message.success("可以使用");
    }
    const wCpay = (data) => {
      // return data

      wxJsBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appId, //公众号名称，由商户传入
          timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, //随机串
          package: data.package,
          signType: "MD5", //微信签名方式：
          paySign: data.sign, //微信
        },
        (res) => {
          console.log("支付回调", res.errMsg);
          message.info(res.errMsg);
          if (res.errMsg == "get_brand_wcpay_request:ok") {
            console.log("zhifu chengg ");
            message.success("支付成功");
          } else {
            message.error("支付失败");
          }
        }
      );
    };
    const rechargeIt = async () => {
      const rechargeM = parseFloat(data.money);
      if (!rechargeM || rechargeM < 0) {
        return message.error("请输入正金额");
      } else {
        try {
          const params = {
            cardNum: cardNum.value,
            money: rechargeM,
          };
          let chargeR = await rechargeMoney(params);
          const payParam = {
            openid: store.state.openid,
            rechargeNum: chargeR.data.rechargeNum,
          };
          let payInfo = await wxPay(payParam);
          // if (payInfo) {
          //   message.success("充值成功");
          //   cardMoney.value = (parseFloat(cardMoney.value) + rechargeM).toFixed(
          //     2
          //   );
          // }
          // console.log(payInfo);
          wCpay(payInfo.data);
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
      // if (data.unbindNum && data.unbindNum == cardNum.value) {
      unbindCards({ cardNum: cardNum.value })
        .then(() => {
          message.success("解绑成功");
          router.push({
            path: "/index",
          });
        })
        .catch((err) => {
          alert(err.msg || "解绑失败");
        });
      // }
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
.unbind-text {
  width: 100%;
  text-align: center;
  margin-top: 100px;
  padding-bottom: 20px;
  color: rgb(25, 104, 250);
}
.meal.active {
  background: var(--green);
  /* color: #fff; */
  border: 1px solid transparent;
}
.meal.active .light-text {
  color: #222;
}
.light-text {
  font-size: 0.9rem;
  color: #798199;
  font-weight: 400;
}
.meal-input {
  height: 80px;
  border: 1px solid var(--green);
  display: flex;
  align-items: center;
  border-radius: 10px;
}
.meal {
  height: 80px;
  border: 1px solid var(--green);
  padding: 0;
  border-radius: 10px;
  text-align: center;
  color: #111;
  font-size: 1.8rem;
  font-weight: 600;
}
.meal-body {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: 16px;
  column-gap: 20px;
  width: 100%;
  flex-wrap: wrap;
}

.ic-num {
  text-align: left;
  padding-left: 20px;
}
.amount-money {
  font-size: 1.2rem;
  font-family: Arial, Helvetica, sans-serif;
}
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
input {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  color: #111;
  height: 60px;
  line-height: 60px;
}
input::placeholder {
  font-size: 1.1rem;
  color: #111;
  font-weight: 500;
  text-align: center;
}

.rechage-title {
  /* width: calc(100% - 40px); */
  width: 100%;
  padding: 10px 20px;
  height: 50px;
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
  padding-top: 20px;
  margin-top: 10px;
  height: calc(100vh - 10px - 50px);
  background: #fff;
}
</style>