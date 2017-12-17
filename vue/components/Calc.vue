<template lang="pug">
#calc-view
  h2 Priskalkyleraren

  mdc-textfield(v-model="price", label="Cirkapris")
  mdc-textfield(v-model="net", label="Inköpspris")

  p(v-if="gross") Bruttopris: {{grossNumber}}
  p(v-if="margin") Marginal: {{margin}}%
</template>

<script>
export default {
  name: "Calc",
  data() {
    return { net: null, price: null };
  },
  computed: {
    margin() {
      if(!this.gross || !this.net) return null;
      
      const net = parseFloat(this.net);
      if(isNaN(net)) return null;
    
    	const diff = 1 - net / this.gross;
      return Math.round(diff * 100);
    },
    gross() {
      if(!this.price) return null;

      const price = parseFloat(this.price);
      return isNaN(price) ? null : price / 1.25;
    },
    grossNumber() {
    	return this.gross.toString().replace(".", ",");
    }
  },
  methods: {}
};
</script>