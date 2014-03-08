'use strict';

module.exports = function (grunt) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install --save-dev` in this project.
   */
  require('load-grunt-tasks')(grunt);

  var banner = '/** <%= pkg.name %> - v<%= pkg.version %> - ' +
    '<%= grunt.template.today("yyyy-mm-dd") %> */\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
      options: {
        banner: banner+'\'use strict\';\n',
        process: function(src, filepath) {
          return '// Source: ' + filepath + '\n' +
            src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
        },
      },
      dist: {
        src: ['<%= buildConfig.src %>/module.js', '<%= buildConfig.src %>/leapConfig.js', '<%= buildConfig.src %>/*.js', '<%= buildConfig.src %>/**/*.js'],
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
      options: {
        banner: banner
      },
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
