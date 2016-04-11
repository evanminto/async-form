'use strict';

module.exports = function(grunt) {

  grunt.registerTask('default', ['watch:dev']);

  grunt.registerTask('build', ['build:all']);
  grunt.registerTask('build:all', ['browserify']);
  grunt.registerTask('build:dev', ['browserify:dev']);
  grunt.registerTask('build:prod', ['browserify:prod']);

  grunt.registerTask('test', [
    'build:dev',
    'jest',
  ]);

  grunt.initConfig({
    npmConfig: require('./package.json'),

    browserify: {
      dev: {
        src: 'src/browser.js',
        dest: 'dist/browser.js',

        options: {
          transform: [
            ['babelify', {
              presets: ['es2015'],
            }],
          ],
        },
      },

      prod: {
        src: 'src/browser.js',
        dest: 'dist/browser.min.js',

        options: {
          transform: [
            ['babelify', {
              presets: ['es2015'],
            }],

            ['uglifyify', {
              unsafe: true,
            }],
          ],
        },
      },
    },

    jest: {
      options: {
        config: 'test/jest.json',
        coverage: true,
        testPathPattern: /.*Test.js/,
      },
    },

    watch: {
      dev: {
        files: ['src/**.js'],
        tasks: ['build:dev'],

        options: {
          atBegin: true,
          spawn: false,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-jest');
  grunt.loadNpmTasks('grunt-contrib-watch');

};
