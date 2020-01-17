var app = new Vue({
  el: '#app',
  data: {
    characterData: null,
    characterState: 'injured',
    injured: false,
    name: null,
    alias: null,
    stats: null,
    defense: null,
    attacks: null,
    superpowers: null,
    disableButton: false,
    showHelp: false,
    helpContent: null,
    splash: true
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
    getData: function(name){
      var vm = this;

      fetch('/app/data/character/' + name + '.json')
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          console.log(data);
          vm.characterData = data;

          // get character data
          vm.displayStats('default');

          setTimeout(function(){
            vm.splash = false;
          }, 1500);
        });
    },
    displayStats: function(state) {
      var vm = this;

      vm.name = vm.characterData.name;
      vm.alias = vm.characterData.alias;
      vm.stats = vm.characterData[state].stats;
      vm.defense = vm.characterData[state].defense;
      vm.attacks = vm.characterData[state].attacks;
      vm.superpowers = vm.characterData[state].superpowers;
    },
    flipCard: function(state){
      var vm = this, body = document.querySelector('body');

      // show injured stats or not
      if (state) {
        vm.injured = false;
        vm.displayStats('default');
        body.classList.remove('injured');
      } else {
        vm.injured = true;
        vm.displayStats('injured');
        body.classList.add('injured');
      }
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
    launchHelp: function(e) {
      var vm = this;
      vm.showHelp = true;
    },
    closeHelp: function(e) {
      var vm = this;
      vm.showHelp = false;
    },
    loadHelp: function() {
      var vm = this;

      fetch('../HELP.md').then(function(response){
        return response.text();
      }).then(function(data){
        var md = window.markdownit();
        vm.helpContent = md.render(data);
      });
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      var vm = this;
      vm.loadHelp();
      vm.getData('captainmarvel');
    });
  }
});