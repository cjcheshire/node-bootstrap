module.exports = function (grunt) {

//  var path = require('path');

  function log(err, stdout, stderr, cb) {
    console.log(stdout);
    cb();
  }

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var folders = {
    app: 'assets',
    dist: 'public',
    heroku: 'heroku',
    tmp: '.tmp'
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    folders: folders,

    express: {
      options: {
        port: 9090,
        hostname: "0.0.0.0"
      },
      livereload: {
        options: {
          server: 'server.js',
          livereload: true,
          bases: ['<%= folders.app %>']
        }
      }
    },

    compass: {
      options: {
        app: "stand_alone",
        sassDir: '<%= folders.app %>/stylesheets',
        cssDir: '<%= folders.dist %>/assets/stylesheets',
        imagesDir: '<%= folders.app %>/images',
        javascriptsDir: '<%= folders.app %>/javascripts',
        fontsDir: '/assets/fonts',
        relativeAssets: false
      },
      server: {
        options: {
          outputStyle: 'expanded' // nested, expanded, compact, compressed
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed' // nested, expanded, compact, compressed
        }
      }
    },

    sass: {
      server: {
        options: {
          outputStyle: 'expanded' // nested, expanded, compact, compressed
        },
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/stylesheets/',
          src: ['*.scss'],
          dest: '<%= folders.dist %>/assets/stylesheets/',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          outputStyle: 'compressed' // nested, expanded, compact, compressed
        },
        files: [{
          expand: true,
          cwd: '<%= folders.app %>/stylesheets/',
          src: ['*.scss'],
          dest: '<%= folders.dist %>/assets/stylesheets/',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version'] // more codenames at https://github.com/ai/autoprefixer#browsers
      },
      css: {
        src: '<%= folders.dist %>/assets/stylesheets/**.css'
      }
    },

    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= folders.app %>/images',
            src: '{,**/}*.{png,jpg,jpeg,gif,svg}',
            dest: '<%= folders.dist %>/assets/images'
          }
        ]
      }
    },

    watch: {
      images: {
        files: ['**/*.jpg', '**/*.png', '**/*.gif'],
        tasks: ['imagemin', 'copy:otherimages']
      },
      sass: {
        files: ['<%= folders.app %>/stylesheets/**/*.scss'],
        tasks: ['compass:server', 'autoprefixer']
      },
      js: {
        files: ['<%= folders.app %>/javascripts/**'],
        tasks: ['copy:js']
      },
      static: {
        files: ['<%= folders.app %>/static/**'],
        tasks: ['copy:static']
      },
      server: {
        options: {
          livereload: true
        },
        files: [
          '<%= folders.app %>/*.html',
          '<%= folders.app %>/stylesheets/{,*/}*.css',
          '<%= folders.app %>/javascripts/{,*/}*.js',
          '<%= folders.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    copy: {
      css: {
        cwd: '<%= folders.app %>',
        src: [
          'stylesheets/**',
          '!**/*.scss'
        ],
        dest: '<%= folders.dist %>/assets',
        expand: true
      },
      js: {
        cwd: '<%= folders.app %>',
        src: ['javascripts/**/*'],
        dest: '<%= folders.dist %>/assets',
        expand: true
      },
      // imagemin doesn't do these
      otherimages: {
        cwd: '<%= folders.app %>',
        src: ['images/**/*.svg', 'images/*.ico'],
        dest: '<%= folders.dist %>/assets',
        expand: true
      },
      static: {
        cwd: '<%= folders.app %>/static',
        src: ['**'],
        dest: '<%= folders.dist %>',
        expand: true
      },
      herokupackage: {
        src: [
          '<%= folders.app %>/jade/**',
          'public/**',
          'package.json',
          'pageData.json',
          'Procfile',
          'server.js'
        ],
        dest: '<%= folders.heroku %>',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ '<%= folders.dist %>' ]
      },
      heroku: {
        src: [ '<%= folders.heroku %>' ]
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%= express.options.port%>'
      },
      deploy: {
        path: 'http://protonode.herokuapp.com'
      }
    },

    exec: {
      deploy: {
        command: 'heroku push <%= folders.heroku %> --app protonode',
        stdout: true,
        stderr: false
      }
    }

  });

  grunt.registerTask('build', [
    'clean:build',
    'imagemin',
    'compass:server',
    'copy:css',
    'copy:js',
    'copy:otherimages',
    'copy:static'
  ]);


  grunt.registerTask('server', [
    'express',
    'build',
    'open:server',
    'watch'
  ]);

  grunt.registerTask('deploy', [
    'clean:build',
    'imagemin',
    'compass:dist',
    'copy:css',
    'copy:js',
    'copy:otherimages',
    'copy:static',
    'clean:heroku',
    'copy:herokupackage',
    'exec:deploy',
    'open:deploy',
    'clean:heroku'
  ]);


};