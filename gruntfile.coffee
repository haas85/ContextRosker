module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    meta:
      file   : 'contextrosker'
      banner : """
        /* <%= pkg.name %> v<%= pkg.version %> - <%= grunt.template.today("dd/mm/yyyy") %>
           <%= pkg.homepage %>
           Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> - Under <%= pkg.license %> License */

        """
    # =========================================================================
    source:
      coffee: [
            "contextrosker.coffee"
          ]

    # =========================================================================
    coffee:
      core_debug: files: '<%=meta.file%>.js': "<%=meta.file%>.coffee"

    uglify:
      options: compress: false
      engine: files: '<%=meta.file%>.min.js': '<%=meta.file%>.js'

    usebanner:
      js:
        options: position: "top", banner: "<%= meta.banner %>", linebreak: false
        files: src: [
          '<%=meta.file%>.min.js',
          '<%=meta.file%>.js'
        ]

    watch:
      coffee:
        files: ["<%= source.coffee %>"]
        tasks: [ "coffee", "uglify", "usebanner"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-banner"

  grunt.registerTask "default", [ "coffee", "uglify", "usebanner"]
