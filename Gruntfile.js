'use strict';

module.exports = function (grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install --save-dev` in this project.
   */
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    buildConfig: {
      src: 'src/',
      dist: 'build',
      name: 'angular-leap'
    },

    watch: {
      scripts: {
        files: ['Gruntfile.js', '<%=buildConfig.src %>/**/*.js'],
        tasks: ['jshint:all', 'karma:unit']
      }
    },

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: ['<%= buildConfig.dist %>/*']
          }
        ]
      }
    },

    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= buildConfig.dist %>',
            src: '*.js',
            dest: '<%= buildConfig.dist %>'
          }
        ]
      }
    },

    concat: {
      dist: {
        src: ['<%= buildConfig.src %>/*.js', '<%= buildConfig.src %>/**/*.js'],
        dest: '<%= buildConfig.dist %>/<%= buildConfig.name %>.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      all: ['Gruntfile.js', '<%=buildConfig.src %>/**/*.js']
    },

    uglify: {
      dist: {
        files: {
          '<%= buildConfig.dist %>/<%= buildConfig.name %>.min.js': [
            '<%= buildConfig.dist %>/<%= buildConfig.name %>.js'
          ]
        }
      }
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md'
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    ngdocs: {
      options: {
        dest: 'site',
        html5Mode: false,
        title: 'angular-leap',
        startpage: '/api'
      },
      api: {
        src: ['src/**/*.js', 'docs/content/api/*.ngdoc'],
        title: 'API Reference'
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint:all',
    'karma:unit',
    'concat',
    'ngmin',
    'uglify'
  ]);


  grunt.registerTask('ci', [
    'jshint:all',
    'karma:unit'
  ]);
};
