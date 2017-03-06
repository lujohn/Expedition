
module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['jasmine'],
		files: [
	      'bower_components/angular/angular.js',
	      'bower_components/angular-mocks/angular-mocks.js',
	      'app/scripts/*.js',
	      'tests/unit/**/*.js'  // all js files in "unit" directory sub-tree
      	],
      	preprocessors: {
    	},
      	port: 9876,
      	reporters: ['progress'],
      	colors: true,
      	logLevel: config.LOG_INFO,
      	autowatch: true,
      	browsers: ['Chrome'], 
      	singleRun: false
	});
}