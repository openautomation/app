/*
 * Basic command library for the 3-axis gantry.
 *
 * Conforms to the JSON command definition schema
 * (which doesn't exist yet).
 */
var grbl = require('grbl');
var fs = require('fs');
var sleep = require('sleep');

this.name = "Mobile Gantry";

var move = commands('Move', {
    description: "moves the gantry to a new location by coordinate",
    styleClasses: "glyphicon glyphicon-screenshot",

    inputs: {
        x: {
            description: "the x axis position",
            type: "integer?"
        },

        y: {
            description: "the y axis position",
            type: "integer?"
        },

        z: {
            description: "the z axis position",
            type: "integer?"
        }
    },

    outputs: {
        location : {
            description: "the location of the gantry after moving",
            type: ["integer", "integer", "integer"]
        }
    }

    //startup:     // called once on startup
    //shutdown:    // called once on shutdown
    //run:         // called each time
});

move.startup = function(options) {
    // configuration file required for gerbl,
    // TODO cause this shouldn't really be here (config.js?)
    var lines = fs.readFileSync("gConfig.txt").toString().split('\n');

    grbl(function(machine) {
        console.log("configuring grbl...");

        for (var i=0; i < lines.length; ++i) {
            machine.write(lines[i]+"\n");
        }

        machine.write("", function() {
            console.log("done!");
            machine.end()
        })
    });
}

move.shutdown = function(options) {
    console.log("shutting down")
    console.log(options)
}

move.run = function(options, inputs, next) {
    var outputs = {};

    grbl(function(machine) {
        console.log("grbling it yo!");

        var helper = function(char) {
            return inputs[char] ? " "+char+inputs[char] : "";
        }

        // line:<Idle,MPos:50.021,50.000,5.008,WPos:50.021,50.000,5.008>

        var lineParser = function(line) {
            var chunks = line.split(",");
            chunks[1] = chunks[1].substring(5);
            return chunks.slice(1, 4);
        }

        machine.on('line', function(line) {
            console.log('line:' + line + '\n');

            if (line.substr(1, 4) == "Idle") {
                outputs.location = lineParser(line);
                console.log("all done");
                machine.end();
            }
        });

        machine.on('end', function() {
            next(outputs);
        })

        var x = helper("x")
        var y = helper("y")
        var z = helper("z")

        var cmd = ["g1", x, y, z, " f10000", "\n"].join("");
        console.log("about to run:\n\n"+cmd);

        // switch to absolute
        machine.write("g90\n", function() {
            console.log("absolute");

            // run the real command
            machine.write(cmd);
        });
    });
}

var moveToLocation = commands('Move to Location', {
    description: "moves the gantry to a new location by name",
    styleClasses: "glyphicon glyphicon-screenshot",

    inputs: {
        location: {
            description: "the name of the location",

            type: function() {
                return '<select id="locationPicker" class="io"></select>'
            }
        }
    },

    outputs: {
        location : {
            description: "the location of the gantry after moving",
            type: ["integer", "integer", "integer"]
        }
    },

    run: function(options, inputs, next) {
        var outputs = {};

        console.log("run mtl");
        outputs.location = [1,2,3]

        next(outputs);
    }
});


// input and output names must be together unique

// within a process, all of the output variable names must be unique


// valid types:
//   "integer"
//   "decimal"
//   "string"
//   "boolean"
//

// string    required string
// string?   optional string (0 or 1)
// string*   optional list of strings (0 or more)
// string+   required list of strings (1 or more)
// ["string", "string"]   list of two strings


/*
// implicit outputs like...
// time - how long did the operation take?
// other meta info (bang?)
*/



//var x = {
//    "string type 1" : "string",
//    "string type 2" : "",
//
//    "integer type 1" : "integer",
//    "integer type 2" : 0,
//
//    "decimal type 1" : "decimal",
//    "decimal type 2" : 0.1  // too much room for error, since 1.0 == 1 in JS
//}

