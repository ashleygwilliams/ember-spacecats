App.GravatarImageComponent = Ember.Component.extend({
  gravatarUrl: function() {
    return "http://www.gravatar.com/avatar/" + hex_md5(this.get('email'));
  }.property('email')
});