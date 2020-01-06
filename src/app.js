var app = new Vue({
  el: '#app',
  data: {
    characterData: null,
    currentCards: null,
    currCard: null,
    currCardName: null,
    currCardTarget: null,
    currCardAction: null,
    currCardAction2: null,
    disableButton: false,
    showHelp: false,
    splash: true
  },
  methods: {
    randomizer: function(max) {
      var vm = this;
      // return Math.random() * (max - min) + min;
      return Math.floor(Math.random() * max);
    },
    formatText: function(text) {
      for(var i=0; i < text.length; i++) {
       text[i] = text[i].replace('[b]', '<strong>').replace('[/b]', '</strong>');
       text[i] = text[i].replace('[em]', '<em>').replace('[/em]', '</em>');
      }
      return text;
    },
    getData: function(name){
      var vm = this;

      fetch('./app/data/ultron-master.carddata.json')
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          // console.log(data);
          vm.characterData = data;
          vm.getAICard();

          setTimeout(function(){
            vm.splash = false;
          }, 2000);
        });
    },
    getCard: function(){
      var vm = this, count, pick, card, actions, selAction, doingAction;

      // pick basic or special
      actions = Object.keys(vm.characterData);
      selAction = vm.randomizer(actions.length);
      doingAction = actions[selAction];

      // get all text
      vm.currentCards = vm.characterData[doingAction];
      data = Object.keys(vm.currentCards);
      count = data.length;
      pick = vm.randomizer(count);
      cardCode = data[pick];
      card = vm.currentCards[cardCode];

      // write out for display
      vm.currCard = cardCode;
      vm.currCardName = vm.formatText(card.name);
      vm.currCardTarget = vm.formatText(card.target);
      vm.currCardAction = vm.formatText(card.action);
      vm.currCardAction2 = card.actionSecondary;
    },
    getAICard: function(e) {
      var vm = this;
      vm.getCard();

      vm.disableButton = true
      setTimeout(function(){
        vm.disableButton = false
      }, 500);
    },
    launchHelp: function(e) {
      var vm = this;
      vm.showHelp = true;
    },
    closeHelp: function(e) {
      var vm = this;
      vm.showHelp = false;
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getData();
    });
  }
})