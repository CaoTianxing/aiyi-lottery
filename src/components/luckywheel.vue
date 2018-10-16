<template>
  <div class="container">
    <div class="title">
      <div class="title-img">
        <img src="../assets/img/sadsdadadasda.png" alt="">
      </div>
    </div>
    <div class="lucky-wheel">
      <div class="wheel-main">
        <div class="wheel-pointer-box">
          <div class="wheel-pointer" @click="rotate_handle()" :style="{transform:rotate_angle_pointer,transition:rotate_transition_pointer}"></div>
        </div>
        <div class="wheel-bg" :style="{transform:rotate_angle,transition:rotate_transition}">
          <div class="prize-list">
            <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
              <div class="prize-pic clearfix">
                <img :src="item.icon">
              </div>
              <div class="prize-count" v-if="item.count" style="color:transparent">
                {{item.count}}
              </div>
              <div class="prize-type">
                {{item.name}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-bg"></div>
      <div class="content">
        <div class="lottery_ticket">您有 {{ NumberOfDraws}} 次抽奖机会</div>
      </div>
      <div class="tip">
        <div class="tip-content">
          <p>1、在陶溪川/瓷博会圈子中发布动态（含作品/文章）将获得一次转盘抽奖机会；</p>
          <p>2、完成一次任意内容分享增加一次获奖机会；</p>
          <p>3、每人每天最多有两次抽奖机会；</p>
          <p>4、现金红包、代金券即时可领，实物奖励客服会联系您领取。</p>
        </div>
      </div>
    </div>
    <transition name="fade">
    <div class="mask" ref="mask" v-show="toast_control">
          <div class="mask-in">
            <img src=".././assets/img/hongbao55564645.png" alt="">
            <span @click="close_toast">×</span>
            <div class="kai" @click="ling"></div>
          </div>
      </div>
    </transition>
    <!--领取粉丝红包-->
    <!--v-show="toast_control2"-->
    <transition name="fade2">
    <div class="mask2" ref="mask" v-show="toast_control2">
      <div class="mask-in">
        <img src=".././assets/img/accountError.png" alt="">
        <div class="number">￥{{Amount}}</div>
        <span @click="close_toast2">×</span>
        <div class="kai" @click="getPrize"></div>
        <div class="ipt">
          <input type="text" placeholder="输入领取支付宝账户" v-model="Account">
        </div>
      </div>
    </div>
    </transition>
    <transition name="fade3">
      <!---->
      <!--v-show="toast_control3"-->
      <div class="mask3" ref="mask" v-show="toast_control3">
        <div class="mask-in">
          <img src=".././assets/img/success.png" alt="">
          <div class="number">￥{{Amount}}</div>
          <span @click="close_toast3">×</span>
          <div class="ipt">{{Account}}</div>
          <div class="haode" @click="isHidden">好的</div>
        </div>
      </div>
    </transition>
    <transition name="fade3">
      <!---->
      <!---->
      <div class="mask4" ref="mask" v-show="toast_control4">
        <div class="mask-in">
          <img src=".././assets/img/chongxinlingqu.png" alt="">
          <span @click="close_toast4">×</span>
          <div class="kai" @click="getPrize2"></div>
          <!--<div class="ipt">{{Account}}</div>-->
          <div class="ipt">
            <input type="text" placeholder="输入领取支付宝账户" v-model="Account">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  var isPrize;
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  export default {

    data() {
      return {
        easejoy_bean: 0, //金豆
        lottery_ticket: 5, //抽奖次数
        prize_list: [
          {
            icon: require("../assets/img/xxcy.png"), // 奖品图片
            count: 1, // 奖品数量
            name: "谢谢参与", // 奖品名称
            isPrize: 0 // 该奖项是否为奖品
          },
          {
            // 戴森吸尘器
            icon: require("../assets/img/faadasads.png"),
            count: 1,
            name: "戴森吸尘器",
            isPrize: 1
          },
          {
            // ipad
            icon: require("../assets/img/ipad@2x.png"),
            count: 1,
            name: "ipad一台",
            isPrize: 1
          },
          {
            // iwatc
            icon: require("../assets/img/iwatc@2x.png"),
            count: 1,
            name: "iwatch一台",
            isPrize: 1
          },
          {
            // 支付宝红包
            icon: require("../assets/img/支付宝红包@2x.png"),
            count: 1,
            name: "现金红包",
            isPrize: 1
          },
          {
            // 100元券
            icon: require("../assets/img/100元券@2x.png"),
            count: 1,
            name: "100元代金券",
            isPrize: 1
          },
          {
            // 50元券
            icon: require("../assets/img/50元券@2x.png"),
            count: 1,
            name: "50元代金券 ",
            isPrize: 1
          },

        ], //奖品列表
        toast_control: false, //抽奖结果弹出框控制器
        toast_control2: false, //抽奖结果弹出框控制器
        toast_control3: false, //抽奖结果弹出框控制器
        toast_control4: false, //抽奖结果弹出框控制器
        hasPrize: false, //是否中奖
        start_rotating_degree: 0, //初始旋转角度
        // rotate_angle: 0, //将要旋转的角度
        rotate_angle: 0, //将要旋转的角度-------------------
        start_rotating_degree_pointer: 0, //指针初始旋转角度
        // rotate_angle_pointer: 0, //指针将要旋转的度数
        rotate_angle_pointer: 0, //指针将要旋转的度数----------------------
        rotate_transition: "transform 6s ease-in-out", //初始化选中的过度属性控制
        rotate_transition_pointer: "transform 12s ease-in-out", //初始化指针过度属性控制
        click_flag: true, //是否可以旋转抽奖
        index: 0,
        browser:{},
        customerId:'',
        NumberOfDraws:0,
        Amount:0,
        // 中奖编号
        Winning:'',
        // 支付宝账户
        Account:''
      };
    },
    created() {
      this.browser = {
        versions: function () {
          var u = navigator.userAgent;
          var app = navigator.appVersion;
          return {         //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('1Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信中打开
            aiyi: u.indexOf('Aiyi') > -1
          };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      }
      this.init_prize_list();
      this.customerId = this.$route.query.visitorId;
      if(this.customerId !== undefined&&this.customerId!=null&&this.customerId!=''){

        // **********************获取抽奖次数**********************************
        this.getAllNum()
      }

    },
    computed: {
      toast_title() {
        return this.hasPrize ? "恭喜您，获得" + this.prize_list[this.index].count + ' ' + this.prize_list[this.index].name : "未中奖";
      },
      toast_pictrue() {
        return this.hasPrize ? require("../assets/img/congratulation.png") : require("../assets/img/sorry.png");
      }
    },
    mounted(){
      window["share"] = function() {
        return {
          isShare: true,
          img: 'https://img.artmkt.cn/1539624960847.jpg',   //This.shareImgUrl'', // 分享显示的缩略图地址
          url: "https://m.app.artmkt.com/lottery/#/", // 分享地址
          summary: "玩转景德镇瓷博会，瓷博会圈子发布内容和向外分享抽取大奖。", // 分享描述
          title: "发布内容，分享有礼", // 分享标题
          thumbImg: 'https://img.artmkt.cn/1539624960847.jpg',//略缩图
          miniId: null,
          miniPath: null
        };
      };
    },
    methods: {
      //此方法为处理奖品数据
      init_prize_list(list) {
      },
      // 点击按钮触发事件
      rotate_handle() {
        this.Amount = 0
        this.customerId = this.$route.query.visitorId;

        if(this.customerId !== undefined&&this.customerId!=null&&this.customerId!=''){
          if(this.NumberOfDraws <= 0){
            Toast('您没有抽奖机会啦');
            // ********************************************************
          }else {
            this.$nextTick(()=> {
              this.$ajax.post('/lottery/draw.app', {
                "customerId": this.customerId
              })
                .then((res) =>  {
                  console.log('抽奖成功',res)
                  if(res.data.errcode =='00000'){
                    this.getAllNum()
                    this.index = res.data.data.lotteryId //指定每次旋转到的奖品下标
                    // 获取中奖金额
                    this.Amount = res.data.data.price / 100
                    // 获取中奖id
                    this.Winning = res.data.data.id
                    this.rotating();
                    var This = this
                    if(this.index == '4'){
                      setTimeout(() => {
                        This.game_over()
                      },6500)
                    }
                  }
                })
            })

          }
        }else {
          if (this.browser.versions.aiyi) {
            if (this.browser.versions.ios) {
              window.open("startLogin(123)")
            } else if (this.browser.versions.android) {
              app.startLogin("123");
            }
          }
        }
        },

      rotating() {
        if (!this.click_flag) return;
        var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
        var during_time = 5; // 默认为1s
        var random = Math.floor(Math.random() * 7);
        var result_index = this.index; // 最终要旋转到哪一块，对应prize_list的下标
        // var result_angle = [337.5, 292.5, 247.5, 202.5, 157.5, 112.5, 67.5, 22.5]; //最终会旋转到下标的位置所需要的度数
        var result_angle = [0, 310, 255, 202.5, 157.5, 105, 50.5,0]; //最终会旋转到下标的位置所需要的度数
        var rand_circle = 6; // 附加多转几圈，2-3
        this.click_flag = false; // 旋转结束前，不允许再次触发
        if (type == 0) {
          // 转动盘子
          var rotate_angle = this.start_rotating_degree + rand_circle * 360 + result_angle[result_index] - this.start_rotating_degree % 360;
          this.start_rotating_degree = rotate_angle;
          this.rotate_angle = "rotate(" + rotate_angle + "deg)";
          console.log(rotate_angle)
          // // //转动指针
          // this.rotate_angle_pointer = "rotate("+this.start_rotating_degree_pointer + 360*rand_circle+"deg)";
          // this.start_rotating_degree_pointer =360*rand_circle;
          var that = this;
          // 旋转结束后，允许再次触发
          setTimeout(function () {
            that.click_flag = true;
            // that.game_over();
          }, during_time * 1000 + 1500); // 延时，保证转盘转完
        } else {
          //
        }
      },
      game_over() {
        this.toast_control = true;
        // this.rotate_angle = "rotate(0deg)";
        // this.rotate_transition ="transform 1s"
        this.hasPrize = this.prize_list[this.index].isPrize
      },
      game_over2() {
        this.toast_control2 = true;
        this.hasPrize = this.prize_list[this.index].isPrize
      },
      ling(){
        this.toast_control = false;
        this.toast_control2 = true
      },
      //关闭弹窗
      close_toast() {

        this.toast_control = false;
        this.Account= ''
      },
      close_toast2() {
        this.toast_control2=false
        this.Account= ''
      },
      close_toast3() {
        this.toast_control3=false
        this.Account= ''
      },
      close_toast4() {
        this.toast_control4=false
        this.Account= ''
      },
      getAllNum(){
        this.$nextTick(()=> {
          this.$ajax.post('/lottery/num.app', {
            "customerId": this.customerId
          })
            .then((res) =>  {
              console.log('剩余抽奖次数',res)
              if(res.data.errcode == '00000'){
                this.NumberOfDraws = res.data.data
              }else {
                Toast(res.data.errmsg)
              }
            })
        })
      },
      getPrize(){
        if(this.Account !== ''){
          this.$nextTick(()=> {
            this.$ajax.post('/lottery/red.app', {
              "customerId": this.customerId,
              "alipay":this.Account,
              "recordId": this.Winning
            })
              .then((res) =>  {
                console.log('领奖成功',res)
                if(res.data.errcode == '00000'){
                  this.Account= ''
                  this.toast_control2=false
                  this.toast_control3=true
                }else if(res.data.errcode == '99998'){
                  this.Account= ''
                  this.close_toast2()
                  this.toast_control4 = true

                  // alert(res.data.errmsg)
                }else {
                  Toast(res.data.errmsg)
                }
              })
              .catch((error) =>  {
                console.log(error);
              });
          })
        }else {
          Toast('请输入正确的支付宝账号')
        }
      },
      getPrize2(){
        if(this.Account !== ''){
          this.$nextTick(()=> {
            this.$ajax.post('/lottery/red.app', {
              "customerId": this.customerId,
              "alipay":this.Account,
              "recordId": this.Winning
            })
              .then((res) =>  {
                console.log('领奖成功',res)
                if(res.data.errcode == '00000'){
                  this.Account= ''
                  this.toast_control4=false
                  this.toast_control3=true
                }else if(res.data.errcode == '99998'){
                  this.Account= ''
                  this.close_toast2()
                  this.toast_control4 = true
                }else {
                  Toast(res.data.errmsg)
                }
              })
              .catch((error) =>  {
                console.log(error);
              });
          })
        }else {
          Toast('请输入正确的支付宝账号')
        }
      },
      isHidden(){
        this.toast_control3 = false
        this.Account= ''
      }
    },
  };
</script>
<style scoped lang="less">
  /*设置IOS页面长按不可复制粘贴，但是IOS上出现input、textarea不能输入，因此将使用-webkit-user-select:auto;*/
  *{
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    -khtml-user-select:none; /*早期浏览器*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
  }
  input,textarea {
    -webkit-user-select:auto; /*webkit浏览器*/
    margin: 0px;
    padding: 0px;
    outline: none;
  }
  *{ -webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-tap-highlight-color: transparent;
    /* For some Androids */
  }

  .title{
    margin-top:3rem;
    padding: 0 1rem;
    /*overflow: hidden;*/
    img{
      width: 100%;
    }
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
    /*transform: translateX(200px);*/
    margin-left: 500px;
  }


  /*入场动画的时间段*/
  /*离场动画的时间段*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.5s;
  }
  .fade2-enter,
  .fade2-leave-to {
    opacity: 0;
    /*transform: translateX(200px);*/
    margin-right: 500px;
  }


  /*入场动画的时间段*/
  /*离场动画的时间段*/
  .fade2-enter-active,
  .fade2-leave-active {
    transition: all 1s;
  }
  *{
    padding: 0;
    margin: 0;
    -webkit-tap-highlight-color: transparent;//透明
  }
  .clearfix:after{
    content: "";
    display: block;
    clear: both;
  }
  .clearfix{
    zoom: 1;
  }

  .container {
    width: 100%;
  }

  .lucky-wheel {
    /*width: 9rem;*/
    width: 100%;
    background-size: 100%;
    padding-top: 1.5625rem;
    margin: 0 auto;
  }

  .wheel-main {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .wheel-bg {
    width: 20.4375rem;
    height: 20.4375rem;
    background: url("../assets/img/cjzpbg.png") no-repeat center top;
    background-size: 100%;
    color: #fff;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    transition: transform 3s ease;
  }

  .wheel-pointer-box {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 100;
    transform: translate(-50%, -60%);
    width: 5.3125rem;
    height: 5.3125rem;
  }

  .wheel-pointer {
    width: 5.3125rem;
    height: 5.3125rem;
    background: url("../assets/img/start.png") no-repeat center top;
    background-size: 90%;
    transform-origin: center 60%;
  }

  .wheel-bg div {
    text-align: center;
  }

  .prize-list {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .prize-list .prize-item {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
  }

  .prize-list .prize-item:first-child {
    top: 0;
    left: 7.3125rem;
    -webkit-transform: rotate(20deg);
    transform: rotate(1deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
    }
    .prize-type{
      width: 100%;
      position: absolute;
      top: 2.1rem;
      left: 0rem
    }

  }


  .prize-list .prize-item:nth-child(2) {
    top: 2rem;
    left: 11.8rem;
    -webkit-transform: rotate(67deg);
    transform: rotate(52deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
    }
    .prize-type{
      position: absolute;
      top: 2.2rem;
      left: 1.5rem
    }
  }

  .prize-list .prize-item:nth-child(3) {
    top: 7.1rem;
    left: 12.5rem;
    -webkit-transform: rotate(-250deg);
    transform: rotate(-259deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
    }
    .prize-type{
      width: 5.75rem;
      position: absolute;
      top: 2.1rem;
      left: 0rem;
    }
  }

  .prize-list .prize-item:nth-child(4) {
    top: 10.8rem;
    left: 10rem;
    -webkit-transform: rotate(-210deg);
    transform: rotate(-201deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
      left: 3.3rem;
    }
    .prize-type{
      position: absolute;
      top: 2.1rem;
      left: 1.8rem
    }
  }

  .prize-list .prize-item:nth-child(5) {
    top: 10.8rem;
    left: 4.4rem;
    -webkit-transform: rotate(-160deg);
    transform: rotate(-154deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
      left: 2.5rem;
    }
    .prize-type{
      position: absolute;
      top: 2.2rem;
      left: 0.8rem
    }
  }

  .prize-list .prize-item:nth-child(6) {
    top: 7.3875rem;
    left: 1.9rem;
    -webkit-transform: rotate(-111deg);
    transform: rotate(-97deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
      left: 3.5rem;
    }
    .prize-type{
      width: 5.75rem;
      position: absolute;
      top: 1.9rem;
      left: 0.6rem
    }
  }

  .prize-list .prize-item:nth-child(7) {
    top: 2.5rem;
    left: 2.5rem;
    -webkit-transform: rotate(-54deg);
    transform: rotate(-47deg);
    img{
      width: 3.75rem;
      height: 3.88rem;
      top: 3rem;
      left: 3.4rem;
    }
    .prize-type{
      position: absolute;
      top: 2.1rem;
      left: 1.8rem
    }
  }

  .prize-item {
    width: 5.875rem;
    height: 9rem;
  }
  .prize-pic{
    /*height: 5rem*/
  }
  .prize-pic img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

  }

  .prize-count {
    font-size: 0.875rem;
  }

  .prize-type {
    font-size: 0.75rem;
    color: #df1e15
  }


  .main {
    position: relative;
    width: 100%;
    min-height: 14.25rem;
    padding-bottom: 1.6875rem;
  }

  .main-bg {
    width: 100%;
    height: 6.5625rem;
    position: absolute;
    top: -3.4375rem;
    left: 0;
  }

  .bg-p {
    width: 100%;
    height: 2.95rem;
    background: rgb(252, 207, 133);
  }

  .content {
    .lottery_ticket{
      margin: 2rem auto;
      background: #ffffff;
      width: 70%;
      font-weight: 400;
      height: 2.1875rem;
      line-height: 2.1875rem;
      font-size: 1rem;
      border-radius: 20rem;
      color: #ff9966;
      text-align: center;
      border: 1px solid #ff8754;
      letter-spacing:0.1rem
    }
  }

  .content div {
    text-align: left;
  }

  .tip {
    position: relative;
    margin: 2.5rem auto 0;
    width: 90%;
  }

  .tip-title {
    position: absolute;
    top: -1rem;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 1rem;
    color: #fccc6e;
    background: rgb(243, 109, 86);
    padding: 0.3125rem 0.625rem;
  }

  .tip-content {
    padding: 0.5625rem 0.005rem;
    font-size: 0.875rem;
    color: #262626;
    line-height: 1.5;
  }
  .mask{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 9999;
    .mask-in{
      width: 85%;
      /*top: 5%;*/
      height: 35rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);

      .kai{
        width: 4.5rem;
        height: 4.5rem;
        position: absolute;
        left: 50%;
        bottom: 25%;
        transform: translateX(-50%);
        background: url('../assets/img/ssdfaasdasd.png');
        -webkit-background-size: cover;
        background-size: cover;
      }
    }
    img{
      width: 100%;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%,-50%);
    }
    span {
      position: absolute;
      width: 5rem;
      height: 5rem;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.4rem;
      color: #fff;
      text-align: center;
      line-height: 5rem;
      margin: 0 auto;
    }
  }
  .mask2{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 900;
    .mask-in{
      width: 85%;
      /*top: 5%;*/
      height: 35rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .number{
        color: #e6231a;
        font-size: 2rem;
        position: absolute;
        left: 50%;
        top: 10.5rem;
        transform: translateX(-50%);
      }
      .kai{
        width: 4.5rem;
        height: 4.5rem;
        position: absolute;
        left: 50%;
        bottom: 25%;
        transform: translateX(-50%);
        background: url('../assets/img/ling.png');
        -webkit-background-size: cover;
        background-size: cover;
      }
      .ipt{
        position: absolute;
        bottom: 17rem;
        left: 50%;
        top: 16.5rem;
        transform: translateX(-50%);
        border: 1px solid red;
        input{
          width: 12rem;
          outline: none;
          height: 1.6rem;
          padding-left:0.2rem;
        }
      }
    }
    img{
      width: 100%;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%,-50%);
    }
    span {
      position: absolute;
      width: 5rem;
      height: 5rem;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.4rem;
      color: #fff;
      text-align: center;
      line-height: 5rem;
      margin: 0 auto;
    }
  }
  .mask3{
     position: fixed;
     width: 100%;
     height: 100%;
     top: 0;
     left: 0;
     background-color: rgba(0,0,0,.7);
     z-index: 9999;
     .mask-in{
       width: 85%;
       /*top: 5%;*/
       height: 35rem;
       position: absolute;
       left: 50%;
       transform: translateX(-50%);
       .number{
         color: #e6231a;
         font-size: 1.6rem;
         position: absolute;
         left: 48%;
         top: 11.4rem;
         transform: translateX(-50%);
       }
       .kai{
         width: 4.5rem;
         height: 4.5rem;
         position: absolute;
         left: 50%;
         bottom: 25%;
         transform: translateX(-50%);
         background: url('../assets/img/ling.png');
         -webkit-background-size: cover;
         background-size: cover;
       }
       .ipt{
         position: absolute;
         bottom: 17rem;
         left: 50%;
         transform: translateX(-50%);
         font-size: 1.5rem;
         color: #fff;
         top: 19rem;
       }
       .haode{
         width: 8rem;
         height: 3.5rem;
         line-height: 3.5rem;
         color: #000;
         background-color: #ffff9b;
         border-radius: 10rem;
         font-size: 2rem;
         font-family: "宋体";
         position: absolute;
         left: 50%;
         top: 23rem;
         z-index: 99999;
         text-align: center;
         transform: translateX(-50%);
       }
     }
     img{
       width: 100%;
       top: 50%;
       left: 50%;
       position: absolute;
       transform: translate(-50%,-50%);
     }
     span {
       position: absolute;
       width: 5rem;
       height: 5rem;
       bottom: 0;
       left: 50%;
       transform: translateX(-50%);
       font-size: 2.4rem;
       color: #fff;
       text-align: center;
       line-height: 5rem;
       margin: 0 auto;
     }
   }
  .mask4{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.7);
    z-index: 9999;
    .mask-in{
      width: 85%;
      /*top: 5%;*/
      height: 35rem;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      .number{
        color: #e6231a;
        font-size: 1.6rem;
        position: absolute;
        left: 48%;
        top: 11.4rem;
        transform: translateX(-50%);
      }
      .kai{
        width: 4.5rem;
        height: 4.5rem;
        position: absolute;
        left: 50%;
        bottom: 25%;
        transform: translateX(-50%);
        background: url('../assets/img/ling.png');
        -webkit-background-size: cover;
        background-size: cover;
      }
      .ipt{
        position: absolute;
        bottom: 17rem;
        left: 50%;
        top: 19rem;
        border:none;
        transform: translateX(-50%);
        input{
          width: 12.5rem;
          outline: none;
          border:none;
          height: 1.7rem;
          padding-left:0.2rem;
        }
      }
    }
    img{
      width: 100%;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%,-50%);
    }
    span {
      position: absolute;
      width: 5rem;
      height: 5rem;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.4rem;
      color: #fff;
      text-align: center;
      line-height: 5rem;
      margin: 0 auto;
    }
  }
  .toast {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 17rem;
    z-index: 99999999;
    border: 1px solid red;
    transform: translate(-50%,-50%);
    margin: 0 auto;

    img{
      width: 50%;
    }
    span {
      width: 5rem;
      height: 5rem;
      display: block;
      font-size: 1.5rem;
      color: #fff;
      text-align: center;
      line-height: 5rem;
      margin: 0 auto;
    }
  }

  .toast-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .toast-picture {
    position: absolute;
    top: -6.5rem;
    left: -1.5rem;
    width: 18.75rem;
    height: 8.5625rem;
  }

  .toast-pictrue-change {
    position: absolute;
    top: -1.5rem;
    left: -1.375rem;
    width: 17.5rem;
    height: 3.125rem;
  }

  .toast-title {
    padding: 2.8125rem 0;
    font-size: 18px;
    color: #fc7939;
    text-align: center;
  }

  .toast-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.9375rem;
  }

  .toast-btn div {
    background-image: -moz-linear-gradient(
      -18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%
    );

    background-image: -ms-linear-gradient(
      -18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%
    );
    background-image: -webkit-linear-gradient(
      -18deg,
      rgb(242, 148, 85) 0%,
      rgb(252, 124, 88) 51%,
      rgb(252, 124, 88) 99%
    );
    box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
    width: 4.6875rem;
    height: 1.875rem;
    border-radius: 1.875rem;
    text-align: center;
    line-height: 1.875rem;
    color: #fff;
  }

  .close {
    position: absolute;
    top: -0.9375rem;
    right: -0.9375rem;
    width: 2rem;
    height: 2rem;
    background: url("../assets/img/close_store.png") no-repeat center top;
    background-size: 100%;
  }
</style>

