"use strict";

module.exports = function(grunt) {
    grunt.initConfig({
        typescript: {
            base: {
                src: ["jThree/src/jThree.ts"],
                dest: "jThree/jThree.js",
                options: {
                    comments: true,
                    target: "es5"
                }

            }
        },
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
                    out: "jThree/docs/",
                    name: "jThree API Reference",
                },
                src: "jThree/src/**/*.ts"
            }
        }
    });
    var branch_name = grunt.option('branch') || 'unknown';
    console.log(branch_name);
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks("grunt-blanket-qunit");
    grunt.loadNpmTasks("grunt-typedoc");
    grunt.registerTask("travis", ["typescript", "connect", "blanket_qunit", "typedoc"]);
    grunt.registerTask("compile", ["typescript"]);
    grunt.registerTask("server", ["connect"]);
    grunt.registerTask("default", ["typescript", "connect", "blanket_qunit"]);

};
