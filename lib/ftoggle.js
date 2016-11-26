#!/usr/bin/env node

var vorpal = require('vorpal')();
var chalk = vorpal.chalk;
var _ = vorpal.lodash;
var envs = ['development', 'devint', 'smoketest', 'production'];
var dir = '/Users/AndrewNichols/code/anichols/manta/manta-frontend/server/config/';
var configs = {
  development: require(dir + 'ftoggle.development.json'),
  devint: require(dir + 'ftoggle.devint.json'),
  smoketest: require(dir + 'ftoggle.smoketest.json'),
  production: require(dir + 'ftoggle.json')
};
var fs = require('fs');
var async = require('async');

vorpal
  .delimiter(chalk.cyan('ftoggle >'))
  .show();

vorpal
  .command('show [path]')
  .alias('tree')
  .description('Display all or part of the current ftoggle config')
  //.autocomplete({
    //data: function(currentStr, cb) {
      //var path, last;

      //if (currentStr.indexOf('.') > -1) {
        //var parts = currentStr.split('.');
        //last = parts.pop();
        //if (parts.length) {
          //path = parts.join('.');
        //}
      //} else {
        //last = currentStr;
      //}

      //var obj = path ? _.get(configs.production.features, path.replace('.', '.features.')).features : configs.production.features;

      //cb(_.keys(obj));
    //}
  //})
  .option('-e, --env <env>', 'The environment config to display (defaults to all)')
  .action(function(args, cb) {
    _.each(args.env || envs, function(env, next) {
      var config = configs[env];
      if (args.path) {
        config = _.get(config, 'features.' + args.path.replace('.', '.features.'));
      }
      config = JSON.stringify(config, null, 2);

      var output = config.replace(/"(.+?)":/g, function(input, key) {
        return chalk.cyan(key) + ':';
      }).replace(/"([^"]+?)"/g, function(input, str) {
        return '"' + chalk.green(str) + '"';
      }).replace(/(true|false)(?!.*["])/g, function(input, key) {
        return chalk.red(key); 
      }).replace(/:\s?([\d\.]+)(?!.*["])/g, function(input, key) {
        return ': ' + chalk.yellow(key);
      });

      console.log(chalk.gray(env));
      console.log(output);
      console.log();
    });

    cb();
  });
