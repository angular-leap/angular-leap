'use strict';

module.exports = function (grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var buildConfig = {
    src : 'src/',
    dist: 'build',
    name: 'angular-leap'
  };

  grunt.initConfig({

    buildConfig: buildConfig,

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
        src : ['<%= buildConfig.src %>/*.js', '<%= buildConfig.src %>/**/*.js'],
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
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'ngmin',
    'uglify'
  ]);
};
