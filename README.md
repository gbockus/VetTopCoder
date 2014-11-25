# Description 
My solution for the Fix My Sick Doggie -- Redux competition is two lighting components, an apex controller and test, and a custom object by the name 
of Animal that has a master detail relationship with a custom object call Animal_Injury.  
Both components make use of Jquery and bootstrap, and the vet reporter cmp uses the bootstrapValidation lib as well.

# VetReporter 
This compoenet shows a series of forms that are filled out by the patients owner that will result in creating an animal with associated injuries.  The 
animal is created based off of filled in form elements, and the injuries are added by clicking an image of the animal and specifying the injury with that location.

# VetViewer: 
This is the component to be used by the vet to view animals that have been entered into the system. All animals are loaded and when one is selected the details are shown.
If the vet then clicks the injuries label it will make a call to load the injuries for the animal and show them on screen.


