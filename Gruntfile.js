module.exports = function(grunt){

var config = {
    connectOptions: {
      base: 'www-root',
      hostname: 'localhost',
      port: 9000
    },
    buildFolder: 'dist',
    livereload: 9001,
    jsLibFiles: [
      'bower_components/leapjs/leap-0.6.4.js',
      'bower_components/leapjs-plugins/main/leap-plugins-0.1.11.js',
      'bower_components/howler.js/howler.js'
    ],
    jsFiles: [
      'app.js'
    ]
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connectOptions: config.connectOptions,
    buildFolder: config.buildFolder,

    connect: {
      server: {
        options: config.connectOptions
      }
    },

    clean: {
      deploy: [config.buildFolder],
      develop: [config.connectOptions.base]
    },

    jade: {
      develop: {
        options: {
          data: {
            jsFiles: config.jsFiles,
            jsLibFiles: config.jsLibFiles,
            develop: true
          }
        },
        files: {
          '<%= connectOptions.base %>/index.html': 'src/jade/index.jade'
        }
      },
      deploy: {
        options: {
          data: {
            jsFiles: ['app-<%= pkg.version %>.min.js'],
            develop: false,
            version: '<%= pkg.version %>'
          }
        },
        files: {
          '<%= buildFolder %>/index.html': 'src/jade/index.jade'
        }
      }
    },

    jshint: {
      files: ['Gruntfile.js', 'src/js/**/*.js'],
      options: {
        globals: {
          console: true
        }
      }
    },

    stylus: {
      develop: {
        options: {
          compress: false,
          "include css": true
        },
        files: {
          '<%= connectOptions.base %>/css/app.css': 'src/stylesheets/app.styl'
        }
      },
      deploy: {
        options: {
          compress: true,
          "include css": true
        },
        files: {
          '<%= buildFolder %>/css/app-<%= pkg.version %>.min.css': 'src/stylesheets/app.styl'
        }
      }
    },

    copy: {
      develop: {
        files: [{
          expand: true,
          src: [
            'assets/**/*'
          ],
          dest: '<%= connectOptions.base %>/',
          cwd: 'src/'
        }, {
          expand: true,
          src: config.jsLibFiles,
          dest: '<%= connectOptions.base %>/js'
        }, {
          expand: true,
          src: config.jsFiles,
          dest: '<%= connectOptions.base %>/js',
          cwd: 'src/js'
        }]
      },
      deploy: {
        files: [{
          expand: true,
          src: [
            'assets/**/*'
          ],
          dest: '<%= buildFolder %>/',
          cwd: 'src/'
        }]
      }
    },

    uglify: {
      deploy: {
        files: {
          '<%= buildFolder %>/js/app-<%= pkg.version %>.min.js': (function() {
            var allFiles = [];

            config.jsFiles.forEach(function(f) {
              allFiles.push('src/js/' + f);
            });

            return config.jsLibFiles.concat(allFiles);
          }())
        }
      }
    },

    open: {
      dev: {
        path: 'http://<%= connectOptions.hostname %>:<%= connectOptions.port %>/index.html',
        app: 'Google Chrome'
      }
    },

    bump: {
      options: {
        pushTo: 'origin'
      }
    },

    watch: {
      livereload: {
        options: {
          livereload: config.livereload
        },
        files: ['<%= connectOptions.base %>/**/*']
      },
      jade: {
        files: ['src/jade/*.jade'],
        tasks: ['jade']
      },
      js: {
        files: ['Gruntfile.js', 'src/js/**/*.js'],
        tasks: ['jshint', 'copy:develop']
      },
      stylus: {
        files: ['src/stylesheets/**/*.styl'],
        tasks: ['stylus:develop']
      },
      assets: {
        files: ['src/assets/**/*'],
        tasks: ['copy:develop']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('develop', ['clean:develop', 'jade:develop', 'stylus:develop', 'jshint', 'copy:develop', 'connect', 'open', 'watch']);
  grunt.registerTask('build', ['clean:deploy', 'jade:deploy', 'stylus:deploy', 'jshint', 'uglify', 'copy:deploy']);
};