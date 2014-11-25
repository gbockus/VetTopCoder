({
  readyState: 0, // 0: initial, 1: configured, 2: loading, 3: loaded
  needsInit: {},
  currentPart: null,
  injuries: [],

  getAnimals: function(component) {
    var action = component.get('c.getAnimals');
    var self = this;
    action.setCallback(this, function(animals) {
      component.set("v.animals", animals.getReturnValue());
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
          bootstrap: "/resource/Gordonk66__aotp_bootstrap/js/bootstrap"
        },
        shim: {
          bootstrap: {deps: ["jquery"]}
        }
      });
      self.readyState = 1;
    }

    // Configured, load the resources
    if (self.readyState === 1) {
      self.readyState = 2;
      requirejs(["jquery", "bootstrap"], function(_jq, _bs) {
        self.readyState = 3;
        // Set the ready flag to indicate JS libs are loaded
        self.ready = true;

        // Use $j rather than $ to avoid jQuery conflicts
        if (typeof jQuery !== "undefined" && typeof $j === "undefined") {
          $j = jQuery.noConflict(false);
          ;
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
  },

  handleAnimalClick: function(cmp, evt) {
    var animalId = $j(evt.target).closest('.animal-tr').attr('id')
    var animals = cmp.get("v.animals");
    animals.forEach(function(animal) {
      if (animal.Id === animalId) {
        cmp.set("v.currentAnimal", animal);
        var animalSetEvent = $A.get("e.Gordonk66:CurrentAnimalSet");
        animalSetEvent.setParams({ "animal": animal }).fire();
      }
    });
  },

  showAnimalTable: function(component) {
    component.set("v.injuries", []);
    component.set("v.currentAnimal", undefined);
    $j('.animal-report').hide();
    $j('.tree-toggler').addClass('icon-plus');
    $j('.injuries-table').find('.injuries-tbody').empty();
    $j('.animal-table').show();
  },

  updateAnimalUI: function(component, animal) {
    $j('.animal-table').hide();
    $j('.owner-name').text(animal.Gordonk66__Owner_Name__c);
    $j('.animal-name').text(animal.Name);
    $j('.animal-age').text(animal.Gordonk66__Animal_Age__c);
    $j('.animal-type').text(animal.Gordonk66__Animal_Type__c);
    $j('.animal-breed').text(animal.Gordonk66__Breed__c);
    $j('.animal-problem').text(animal.Gordonk66__Problem__c);
    $j('.animal-report').removeClass('hidden').show();
    component.set('v.currentAnimal', animal);
  },

  getAndShowInjuries: function(component) {
    var injuriesLoaded = component.get('v.injuries'),
      currentAnimal = component.get('v.currentAnimal');
    if (!injuriesLoaded || injuriesLoaded.length === 0) {
      var action = component.get('c.getAnimalInjuries');
      action.setParams({
        animalId: currentAnimal.Id
      })
      var self = this;
      action.setCallback(this, function(injuries) {
        component.set("v.injuries", injuries.getReturnValue());
        self.showInjuries(component);
      });
      $A.enqueueAction(action);
    } else {
      this.showInjuries(compoent);
    }
  },

  showInjuries: function(component) {
    var tbody = $j('.injuries-table').find('.injuries-tbody'),
      injuries = component.get('v.injuries'),
      tbodyHTML = '';
    tbody.empty();
    $j('.tree-toggler').removeClass('icon-plus');
    if (injuries.length !== 0) {
      injuries.forEach(function(injury) {
        tbodyHTML += "<tr><td>" + injury.Name + "</td><td>" + injury.Gordonk66__Injury_Description__c + "</td></tr>";
      });
    } else {
      tbodyHTML = "<tr><td>NONE</td><td></td></tr>";
    }
    tbody.append(tbodyHTML);

    $j('.injuries-table').removeClass('hidden').show();
  }
})
