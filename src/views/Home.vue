<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Intro msg="Welcome to the Belt, buddy" />
    <p/>
    <a href="#" @click="showModal = true"><b>Top up Belt's lightning network channel</b></a>
    <p/>
    [ Belt's node <a href="https://1ml.com/node/022ddd76775a0deb9fc80acc3399bc19a5bb6fcb8a5acbd47ae7a9a98a7ca05ffe" target="_blank">info</a> ]
    <Modal v-if="showModal" @close="showModal = false"></Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import Intro from "@/components/Intro.vue";
import Modal from './Modal'


export default {
  name: "home",
  components: {
    Intro,
    Modal
  },
  data: function() {
    return {
      message: "",
      showCheckout: true,
      showModal: false,
    }
  },
};
</script>
