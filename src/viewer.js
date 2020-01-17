var app = new Vue({
  el: '#app',
  data: {
    characterList: {
      "ultron-master": "Ultron, Master of Metal",
      "captainmarvel": "Captain Marvel"
    },
    selCharacter: null,
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
    splash: true,
    loading: true
  },
  methods: {
    randomizer: function(max) {
      var vm = this;
      // return Math.random() * (max - min) + min;
      return Math.floor(Math.random() * max);
    },
    getData: function(name){
      var vm = this;

      fetch('/app/data/character/' + name + '.json')
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          vm.characterData = data;

          // get character data
          vm.displayStats('default');
          vm.splash = false;
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
    launchMenu: function(e) {
      var vm = this;
      vm.splash = true;
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

      fetch('./HELP.md').then(function(response){
        return response.text();
      }).then(function(data){
        var md = window.markdownit();
        vm.helpContent = md.render(data);
      });
    },
    formatText: function(text) {
      if (!text) return '';
      text = text.toString();
      return text.replace(/(\[b\])/g, '<strong>')
        .replace(/(\[\/b\])/g, '</strong>')
        .replace(/(\[em\])/g, '<strong>')
        .replace(/(\[\/em\])/g, '</strong>')
        .replace(/(\[damage\])/g, '<span class="inline-svg"><svg><use xlink:href="#wound" /></svg></span>')
        .replace(/(\[power\])/g,  '<span class="inline-svg"><svg><use xlink:href="#power" /></svg></span>')
        .replace(/(\[range\])/g,  '<span class="inline-svg"><svg><use xlink:href="#range" /></svg></span>')
        .replace(/(\[energy\])/g, '<span class="inline-svg"><svg><use xlink:href="#energy" /></svg></span>');
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      var vm = this;
      vm.loadHelp();
      // vm.getData('captainmarvel');
      vm.loading = false;
    });
  }
});