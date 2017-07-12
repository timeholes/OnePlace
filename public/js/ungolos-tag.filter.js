(function () {
  "use strict";

var ungolos_changes = [
  ['щ', 'shch'],
  ['ые', 'yie'],
  ['ё', 'yo'],
  ['ж', 'zh'],
  ['й', 'ij'],
  ['х', 'kh'],
  ['ч', 'ch'],
  ['ш', 'sh'],
  ['ъ', 'xx'],
  ['э', 'ye'],
  ['ю', 'yu'],
  ['я', 'ya'],
  ['а', 'a'],
  ['б', 'b'],
  ['в', 'v'],
  ['г', 'g'],
  ['д', 'd'],
  ['е', 'e'],
  ['з', 'z'],
  ['и', 'i'],
  ['к', 'k'],
  ['л', 'l'],
  ['м', 'm'],
  ['н', 'n'],
  ['о', 'o'],
  ['п', 'p'],
  ['р', 'r'],
  ['с', 's'],
  ['т', 't'],
  ['у', 'u'],
  ['ф', 'f'],
  ['ц', 'cz'],
  ['ь', 'x'],
  ['ы', 'y']
];
var letters = ungolos_changes.map(function (el) {return el[0];});

angular.module('oneplace')
  .filter('ungolos', function () {

    return function (input) {
      if (!letters.includes(input.toLowerCase().substring(0, 1))) {
        return input;
      }
      var output = 'ru--' + input.toLowerCase();
      for (var change in ungolos_changes) {
        output = output.replace(new RegExp(ungolos_changes[change][0], 'g'), ungolos_changes[change][1]);
      }
      return output;
    };
  });
  
  })();