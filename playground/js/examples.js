define(function() {

  function callChangeHandler(def) {
    if (this.changeHandler) {
      this.changeHandler({
        pkjsSrcURL: def.pkjsSrcURL,
        rockySrcURL: def.rockySrcURL
      });
    }
  }

  function onSelectChange(e) {
    var option = e.target.selectedOptions[0];
    var def = JSON.parse(option.value);
    this.callChangeHandler(def);
  }

  var boundSelectElem;
  function bindToSelectElem(selectElem) {
    boundSelectElem = selectElem;
    for (var i = 0; i < this.exampleDefs.length; i++) {
      var optionElem = document.createElement('option');
      var def = this.exampleDefs[i];
      optionElem.value = JSON.stringify(def);
      optionElem.innerText = def.displayName;
      selectElem.appendChild(optionElem);
    }
    selectElem.addEventListener('change', onSelectChange.bind(this));
  }

  function setChangeHandler(changeHandler) {
    this.changeHandler = changeHandler;
  }

  function setSelectedIndex(idx) {
    boundSelectElem.selectedIndex = idx;
    var def = this.exampleDefs[idx];
    this.callChangeHandler(def);
  }

  var Examples = function(exampleDefs) {
    this.exampleDefs = exampleDefs;
    this.bindToSelectElem = bindToSelectElem;
    this.setChangeHandler = setChangeHandler;
    this.setSelectedIndex = setSelectedIndex;
    this.callChangeHandler = callChangeHandler;
  };

  return Examples;
});
