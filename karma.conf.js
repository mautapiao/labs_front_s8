module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir:'.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    // aqui se muestra el navegador con los test
    browsers: ['Chrome'],
    singleRun: false,   
    autoWatch: true,

    // esta opcion para que no salga el navegador 
   // browsers: ['ChromeHeadless'],
   // singleRun: true,
   // autoWatch: false,
    restartOnFileChange: true
  });
};
