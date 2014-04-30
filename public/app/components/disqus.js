Ember.Component.extend({
  didInsertElement: function() {
    // The first time this component is used it will
    // load the DISQUS API. Each subsequent time will
    // only refresh the state to display the correct
    // comments.
    if (window.DISQUS) {
      DISQUS.reset({
        reload: true,
        config: function() {
          this.page.url = window.location.toString();
        }
      });
    } else {
      var head = (document.head || document.getElementsByTagName('head')[0]);
      var script = document.createElement('script');
      script.async = true;
      script.src = 'http://' + this.get('shortname') + '.disqus.com/embed.js';
      head.appendChild(script);
    }
  }
});
