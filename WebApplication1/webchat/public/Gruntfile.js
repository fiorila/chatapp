/// <binding ProjectOpened='watch' />
/*global module */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        // read in the project settings from the package.json file into the pkg property
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['app/*.js', 'Content/*.css', 'index.html'],
                tasks: ['build-dev']
            }
        },
        exec: {
            deploy: {
                cmd: "firebase deploy"
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');

    // define the default task that can be run just by typing "grunt" on the command line
    // the array should contains the names of the tasks to run

    grunt.registerTask("build", ["exec:deploy"]);
};