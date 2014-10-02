module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['src/js/jquery.js', 'src/js/bootstrap.js', 'src/js/jquery.fittext.js', 'src/js/bigscreen.js', 'src/js/multilingual_social_media.js', 'src/js/app.js'],
        // the location of the resulting JS file
        dest: 'js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    cssmin: {
      add_banner: {
        options: {
          banner: '/* Geografia del Dolor */'
        },
        files: {
          'css/<%= pkg.name %>.min.css': ['src/css/**/*.css']
        }
      }
    },
    watch: {
      styles: {
        files: ['src/css/**/*.css', 'src/js/**/*.js'], // which files to watch
        tasks: ['less', 'concat', 'uglify'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['cssmin', 'concat', 'uglify']);
}
