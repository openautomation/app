
/**
 * Add :volume of :solution to :containers
  - Incubate :container at :temperature for :duration
  - Measure :property at :constraints (Read absorbance...)
  - Discard :solution from :containers
 */

var stepsStrings = [
  'Add 100ul of negative or positive control or sample to each well',
  'Incubate the plate at 37C for 60min',
  'Discard the solution in each well (aspirating or decanting)',
  'Repeat 4-6 times (this is a "wash" recipe):',
  '  - Add 200-300ul washing buffer to each well',
  '  - Discard solution in each well',
  'Aspirate or decant each well to ensure no fluid',
  'Invert plate and blot on paper towel',
  'Add 100ul Enzyme Conjugate to each well',
  'Incubate plate at 37C for 30min',
  'Repeat 4-6 times (this is a "wash" recipe again):',
  '  - Add 200-300ul washing buffer to each well',
  '  - Discard solution in each well',
  'Add 100ul of Substrate (TMB) Solution to each well',
  'Incubate at 37C for 15min (protect from light)',
  'Add 100ul of Stop Solution to each well and mix *well*',
  'Read absorbance at 450nm within 30min after adding '
];

var parser = require('./lib/steps');
parser.use(/(\w+)\s(\w+)[^\d]+(\d+C)[^\d]+(\d+min)/, function(_, action, object, temperature, duration){
  return {
    action: action, 
    object: object, 
    temperature: temperature,
    duration: duration
  }
});
