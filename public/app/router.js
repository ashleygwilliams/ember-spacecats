App.Router.map(function() {
  this.resource('spacecats', { path: '/' });
});

App.ApplicationRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON('http://sinatra-spacecats.herokuapp.com/spacecats').then(function(data) {
      return data;
    });
  }
});