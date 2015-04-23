"use strict";

module.exports = function (grunt) {
    
    var branch_name = grunt.option('branch') || 'unknown';
    var ci_docoutput = "ci/docs/"+branch_name;

    /**************************
     *    LOAD NPM TASKS      *
     **************************/
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-blanket-qunit");
    grunt.loadNpmTasks("grunt-typedoc");
    grunt.loadNpmTasks("grunt-webpack");
    grunt.initConfig({
        typescript: {
            base: {
                src: ["jThree/src/jThree.ts"],
                dest: "jThree/packed.jThree.js",
                options: {
                    comments: true,
                    target: "es5"
                }

            }
        },
        webpack: {
            aftercompile: {
                entry: "./jThree/src/jThree.js",
                output: {
                    path:"./jThree/src",
                    filename:"jThree.js"
                }
            }
        }
            ,
        qunit: {
            all: {
                options: {
                    urls: [
                        "http://localhost:8081/jThree/test/MathTest.html"
                    ]
                }
            }
        },
        connect: {
            local: {
                options: {
                    port: 8081

                }
            }
        },
        blanket_qunit: {
            all: {
                options: {
                    urls: ["http://localhost:8081/jThree/test/MathTest.html?coverage=true&gruntReport"],
                    threshold: 20
                }
            }
        },
        typedoc: {
            build: {
                options: {
                    target: "es5",
                    out: ci_docoutput,
                    name: "jThree API Reference",
                },
                src: "jThree/src/**/*.ts",
                json:"doc-output.json"
            }
        }
    });
    /***********************
     *    REGISTER TASKS   *
     ***********************/
    grunt.registerTask("travis", ["typescript","webpack", "connect", "blanket_qunit", "typedoc"]);
    grunt.registerTask("compile", ["typescript"]);
    grunt.registerTask("server", ["connect"]);
    grunt.registerTask("default", ["typescript", "connect", "blanket_qunit"]);

};
