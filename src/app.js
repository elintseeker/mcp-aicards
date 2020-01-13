var app = new Vue({
  el: '#app',
  data: {
    selectedData: null,
    characterData: null,
    currentCards: null,
    currCard: null,
    currCardName: null,
    currCardTarget: null,
    currCardAction: null,
    currCardAction2: null,
    currCardEtc: null,
    disableButton: false,
    showHelp: false,
    splash: true,
    prevCard: 'B1'
  },
  methods: {
    randomizer: function(max) {
      var vm = this;
      // return Math.random() * (max - min) + min;
      return Math.floor(Math.random() * max);
    },
    formatText: function(text) {
      if (text) {
        for(var i=0; i < text.length; i++) {
          text[i] = text[i].replace(/(\[b\])/g, '<strong>')
                      .replace(/(\[\/b\])/g, '</strong>')
                      .replace(/(\[em\])/g, '<strong>')
                      .replace(/(\[\/em\])/g, '</strong>');
        }
      }
      return text;
    },
    getData: function(dataName){
      var vm = this;

      var item = dataName || vm.selectedData;

      fetch('app/data/' + item + '.deckdata.json')
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          // console.log(data);
          vm.characterData = data;

          // get first card (move)
          vm.getCard('basic', vm.prevCard);
          setTimeout(function(){
            vm.splash = false;
          }, 1500);
        });
    },
    getCard: function(actionType, cardName){
      var vm = this, count, card, cardCode, actions, selAction, doingAction;

      if (actionType && cardName) {
        cardCode = cardName;
        card = vm.characterData[actionType][cardName]
      } else {
        // pick basic or special
        actions = Object.keys(vm.characterData);
        selAction = vm.randomizer(actions.length);
        doingAction = actions[selAction];

        // get all text
        vm.currentCards = vm.characterData[doingAction];
        data = Object.keys(vm.currentCards);
        cardCode = data[vm.randomizer(data.length)];
        card = vm.currentCards[cardCode];
      }

      // write out for display
      vm.currCard = cardCode;
      vm.currCardName = vm.formatText(card.name);
      vm.currCardTarget = vm.formatText(card.target);
      vm.currCardAction = vm.formatText(card.action);
      vm.currCardAction2 = vm.formatText(card.actionSecondary);
      vm.currCardEtc = vm.formatText(card.actionEtc);
    },
    getAICard: function(e) {
      var vm = this;

      vm.getCard();
      
      // console.log(vm.currCard, vm.prevCard);
      // if (vm.currCard !== vm.prevCard) {
      //   vm.prevCard = vm.currCard;
      // } else {
      //   vm.getCard();
      //   console.log('getting new card...');
      // }

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
      // this.getData();
      this.getData('basic');
    });
  }
})