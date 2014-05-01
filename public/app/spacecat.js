App.Spacecat = DS.Model.extend({
  name: DS.attr('string'),
  bio: DS.attr('string'),
  color: DS.attr('string'),
  personality: DS.attr('string'),
  planets: DS.attr('integer'),
  images: DS.attr('text')
});
