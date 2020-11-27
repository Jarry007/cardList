<template>
  <div id="app">
     <router-view />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  
}
</script>

<style>
#app {
  --green:rgb(98,213,180);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  background: #eee;
  padding: 0;
  /* margin-top: 60px; */
}
input:-internal-autofill-selected {
  background: transparent !important;
  /* border-bottom: 1px solid cornflowerblue; */
}
input::placeholder {
  background: transparent;
  /* font-size: 0.9rem; */
  color: #bcc1c5;
}
input:focus {
  outline: none;
}
input {
  border: none;
  font-size: 1rem;
  height: 38px;
  line-height: 38px;
  width: 100%;
}
input[type="text" i] {
  padding: 0 0 0 20px;
}
.input-label {
  width: 40px;
  /* line-height: 40px; */
  color: #222;
}
.login-input {
  display: flex;
  height: 50px;
  align-items: center;
  width: 100%;
  font-size: 1rem;
  /* background: deepskyblue; */
  border-bottom: 1px solid #eee;
}
.modal-container {
  width: 90%;

  left: 5%;
  height: 200px;
  background: #fff;
  position: absolute;
  top: 26%;
  border-radius: 10px;
}
.modal-title {
  margin-top: 10px;
  text-align: center;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 500;
}
.modal-close {
  width: 50px;
  height: 50px;
  line-height: 50px;
  /* border: 1px dashed cornflowerblue; */
  background: #222;
  color: #fff;
  border-radius: 6px;
  text-align: center;
  position: absolute;
  left: calc(50% - 25px);
  bottom: 20vh;
}
.modal {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1000;
  backdrop-filter: blur(6px);
  background: rgb(37 37 37 / 40%);
}
</style>
