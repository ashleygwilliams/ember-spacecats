var fs = require('fs');
var stylus = require('stylus');
var path = require('path');
var dive = require('diveSync');
var template = require('ember-template-compiler');
var Gaze = require('gaze').Gaze;


var tinylr = require('tiny-lr-fork');
var liveReload = tinylr();
liveReload.listen(35729);

// watch and actively recompile stylus
var srcDir = 'styles';
var srcFile = 'style.styl';
var destDir = 'public';
var destFile = 'style.css';
var src = path.join(srcDir, srcFile);
var dest = path.join(destDir, destFile);
var compileCSS = function (cb) {
  console.log('Compiling stylus...');
  var input = fs.readFileSync(src, 'utf-8');
  var config = {
    filename: src,
    paths: [path.resolve(srcDir)]
  };
  stylus.render(input, config, function (err, css) {
    if (!err) {
      fs.writeFileSync(dest, css);
      if(cb) {
        cb();
      }
    } else {
      console.log(err);
    }
  });
};

// watch and compile css
var watchCSS = new Gaze('styles/**/*');
watchCSS.on('ready', function() {
  compileCSS();
});
watchCSS.on('all', function () {
  compileCSS(function () {
    console.log('Triggering reload.');
    liveReload.changed({
      body: {
        files: ['index.css']
      }
    });
  });
});

// actively compile templates in development
var watchTemplates = new Gaze('public/app/templates/**/*');
var compileTemplates = function () {
  var output = [];
  dive('public/app/templates', function (err, file) {
    var content = template.precompile(fs.readFileSync(file, 'utf-8'));
    var name = path.basename(file, '.hbs');
    output.push('Ember.TEMPLATES["'+name+'"] = Ember.Handlebars.template('+content+');');
  });
  fs.writeFileSync('public/templates.js', output.join('\n'));
  console.log('Compiling templates...');
  liveReload.changed({body:{files:['public/templates.js']}});
};
watchTemplates.on('ready', compileTemplates).on('changed', compileTemplates);

// actively reload any time app files change
var watchApp = new Gaze(['public/app/**/*', '!public/app/templates']);
watchApp.on('changed', function (event, filepath) {
  console.log('Triggering reload.');
  liveReload.changed({body:{files:['app.js']}});
})

// start development server
var express = require('express');
var app = express();
app.use(express.static('public'));
app.listen(8000);
console.log('Server listening on http://localhost:8000');
