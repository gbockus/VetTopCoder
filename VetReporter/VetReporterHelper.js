({
  readyState: 0, // 0: initial, 1: configured, 2: loading, 3: loaded
  needsInit: {},
  currentPart: null,
  injuries: [],

  showTypeForm: function() {
    if ($j('.animal-form').data('bootstrapValidator').isValid()) {
      $j('.description-section').hide();
      $j('.type-section').removeClass('hidden');
      $j('.type-section').show();
    }
    return;
  },

  upateAnimalPic: function(animal) {
    var cls;
    animal = animal || '';
    cls = animal.toLowerCase();
    $j('.animal-pic').removeClass('dog');
    $j('.animal-pic').removeClass('cat');
    $j('.animal-pic').removeClass('horse');

    $j('.animal-pic').addClass(cls);

    if (cls.length > 0) {
      $j('.animal-section').removeClass('hidden');
      $j('.animal-section').show();
      $j('.type-section').hide();
    } else {
      $j('.animal-section').addClass('hidden');
      $j('.type-section').show();
    }
    return;
  },

  removeInjuryForm: function(evt) {
    $j('.injury-form').hide();
    $j('.animal-section').show();
    this.currentPart = null;
    return;
  },

  saveInjury: function(evt) {
    var animalForm = $j(evt.target).parent().parent().parent().parent();
    if (animalForm.data('bootstrapValidator').isValid()) {
      this.injuries.push({
        name: this.currentPart,
        desc: animalForm.find('.injury-description').val()
      });
      $j('.injury-count').text(this.injuries.length);
      this.currentInjury = null;
      $j('.injury-form').hide();
      $j('#submitButton').removeClass('hidden');
      $j('#submitButton').show();

      $j('.animal-section').show();
      $j('#saveBtn').removeClass('disabled');
    }
    return;
  },

  handleAnimalClick: function(evt) {
    var part = evt.target.id;
    this.currentPart = part;
    if (part === 'backLeg-' || part === 'frontLeg-') {
      $j('.leg-selector').removeClass('hidden');
      $j('.leg-selector').show();
    } else {
      this.addInjuryForm();
    }
    return;
  },

  updateLeg: function(side) {
    this.currentPart = this.currentPart + side;
    $j('.leg-selector').hide();
    return this.addInjuryForm();
  },

  addInjuryForm: function() {
    $j('.injury-label').text(this.currentPart);
    $j('.injury-description').val('');
    $j('.injury-form').removeClass('hidden').show(function() {
      $j('.injury-form').data('bootstrapValidator').resetForm();
    });
    $j('.animal-section').hide();
    return;
  },

  reset: function() {
    this.currentPart = null;
    this.injuries = [];
    $j('.leg-selector').hide();
    $j('.animal-section').hide();
    $j('.injury-form').hide();
    $j('.type-section').hide();
    $j('#submitButton').hide();

    // reset all fields
    $j("#ownername").val('');
    $j("#animalName").val('');
    $j("#animalAge").val('');
    $j("#animalBreed").val('');
    $j("#problemDescription").val('');
    $j('.injury-count').text('0');

    // disable save button
    $j('#saveBtn').addClass('disabled');

    // reset selector
    $j('#typeSelector').prop('selectedIndex', -1);
    $j('.description-section').show(function() {
      $j('.animal-form').data('bootstrapValidator').resetForm();
    });
    return;
  },

  save: function(component) {
    var action = component.get('c.insertAnimal'),
      paramsObj = {
        name: $j("#animalName").val(),
        ownerName: $j("#ownername").val(),
        problemDesc: $j("#problemDescription").val(),
        breed: $j("#animalBreed").val(),
        animalType: $j("#typeSelector").val(),
        age: $j("#animalAge").val()
      }
    action.setParams(paramsObj);
    var self = this;
    action.setCallback(this, function(a) {
      var animal;
      if (a.getState() === "SUCCESS") {
        animal = a.getReturnValue();
        self.insertInjuries(component, animal.Id);
      } else if (a.getState() === "ERROR") {
        var errors = a.getError();
        if (errors) {
          $A.logf("Errors", errors);
          if (errors[0] && errors[0].message) {
            $A.error("Error message: " + errors[0].message);
          }

        } else {
          $A.error("Unknown error");
        }
      } else {
        alert("Action state: " + a.getState());
      }

    });
    $A.enqueueAction(action);
  },

  insertInjuries: function(component, animalId) {
    var injury = this.injuries.pop(),
      action, paramsObj;

    action = component.get('c.insertInjury');
    paramsObj = {
      animalId: animalId,
      name: injury.name,
      injuryDesc: injury.desc
    };

    action.setParams(paramsObj);
    var self = this;
    action.setCallback(this, function(a) {

      if (a.getState() === "SUCCESS") {
        if (self.injuries.length === 0) {
          self.reset();
        } else {
          self.insertInjuries(component, animalId);
        }

      } else if (a.getState() === "ERROR") {
        var errors = a.getError();
        if (errors) {
          $A.logf("Errors", errors);
          if (errors[0] && errors[0].message) {
            $A.error("Error message: " + errors[0].message);
          }

        } else {
          $A.error("Unknown error");
        }
      } else {
        alert("Action state: " + a.getState());
      }

    });
    $A.enqueueAction(action);
  },

  initScripts: function(component) {
    var self = this;

    // If readyState is 3, do nothing
    if (this.readyState === 3) {
      // Set things up using the helper
      self.initHandlers(component, event);
      return;
    }

    self.needsInit[component.getGlobalId()] = component;

    // If requirejs hasn't been loaded, do nothing
    if (typeof requirejs === "undefined") {
      return;
    }

    // Initial readyState, configure requirejs
    if (self.readyState === 0) {
      requirejs.config({
        baseUrl: "/resource/",
        paths: {
          jquery: "/resource/Gordonk66__jquery/jquery",
          bootstrap: "/resource/Gordonk66__aotp_bootstrap/js/bootstrap",
          bootstrapValidator: "/resource/Gordonk66__bootstrapvalidator/bootstrapvalidator/dist/js/bootstrapValidator"
        },
        shim: {
          bootstrap: {deps: ["jquery"]},
          bootstrapValidator: {deps: ["jquery"]}
        }
      });
      self.readyState = 1;
    }

    // Configured, load the resources
    if (self.readyState === 1) {
      self.readyState = 2;
      requirejs(["jquery", "bootstrap", "bootstrapValidator"], function(_jq, _bs) {
        self.readyState = 3;
        // Set the ready flag to indicate JS libs are loaded
        self.ready = true;

        // Use $j rather than $ to avoid jQuery conflicts
        if (typeof jQuery !== "undefined" && typeof $j === "undefined") {
          $j = jQuery.noConflict(false);;
        }

        // Call initHandlers for all components in needsInit
        for (var id in self.needsInit) {
          self.initHandlers(self.needsInit[id]);
          delete self.needsInit[id];
        }
      });
    }
  },

  initHandlers: function(component, event) {
    var self = this;

    $j('.animal-form').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        ownername: {
          message: 'The username is not valid',
          validators: {
            notEmpty: {
              message: 'The owner name cannot be empty'
            },
            stringLength: {
              min: 6,
              max: 30,
              message: 'Must have between 6-30 characters'
            }
          }
        },
        animalname: {
          message: 'The animal name is not valid',
          validators: {
            notEmpty: {
              message: 'The name cannot be empty'
            },
            stringLength: {
              max: 80,
              message: 'limited to 80 characters'
            }
          }
        },
        age: {
          message: 'The age is not valid',
          validators: {
            notEmpty: {
              message: 'The age cannot be empty'
            },
            regexp: {
              regexp: /^[0-9]+$/,
              message: 'Age must be a number'
            }
          }
        },
        breed: {
          message: 'The breed is not valid',
          validators: {
            notEmpty: {
              message: 'The breed cannot be empty'
            },
            stringLength: {
              max: 30,
              message: 'limited to 30 characters'
            }
          }
        },
        problemdesc: {
          message: 'The description is not valid',
          validators: {
            notEmpty: {
              message: 'The description cannot be empty'
            },
            stringLength: {
              max: 255,
              message: 'limited to 255 characters'
            }
          }
        }
      }
    });

    $j('.injury-form').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        injuryDescription: {
          message: 'The injury is not valid',
          validators: {
            notEmpty: {
              message: 'The injury cannot be empty'
            },
            stringLength: {
              max: 255,
              message: 'limited to 255 characters'
            }
          }
        }
      }
    });

    // Add a change listener to the type selector
    $j("#typeSelector")
      .change(function() {
        self.upateAnimalPic($j("#typeSelector option:selected").text());
      });
  }
})
