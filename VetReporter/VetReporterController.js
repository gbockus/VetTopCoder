({
  initScripts: function(component, event, helper) {
    helper.initScripts(component);
  },

  handleDescriptionClick: function(component, event, helper) {
    helper.showTypeForm();
  },

  handleAnimalClick: function(component, event, helper) {
    helper.handleAnimalClick(event);
  },

  addInjury: function(component, event, helper) {
    helper.saveInjury(event);
  },

  cancelAddInjury: function(component, event, helper) {
    helper.removeInjuryForm(event);
  },

  pickLeft: function(component, event, helper) {
    helper.updateLeg('left');
  },

  pickRight: function(component, event, helper) {
    helper.updateLeg('right');
  },

  reset: function(component, event, helper) {
    helper.reset();
  },

  save: function(component, event, helper) {
    debugger;
    helper.save(component);
  }

})
