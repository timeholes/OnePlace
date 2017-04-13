var golos_changes = {
  'shch': 'щ',
  'yo': 'ё',
  'zh': 'ж',
  'ij': 'й',
  'kh': 'х',
  'ch': 'ч',
  'sh': 'ш',
  'xx': 'ъ',
  'ye': 'э',
  'yu': 'ю',
  'ya': 'я',
  'a': 'а',
  'b': 'б',
  'v': 'в',
  'g': 'г',
  'd': 'д',
  'e': 'е',
  'z': 'з',
  'i': 'и',
  'k': 'к',
  'l': 'л',
  'm': 'м',
  'n': 'н',
  'o': 'о',
  'p': 'п',
  'r': 'р',
  's': 'с',
  't': 'т',
  'u': 'у',
  'f': 'ф',
  'c': 'ц',
  'x': 'ь',
  'y': 'ы'
};

angular.module('oneplace')
  .filter('golos', function () {

    return function (input) {
      if (input.substring(0,4) != 'ru--') {
        return input.substring(0, 1).toUpperCase() + input.substring(1).toLowerCase();
      }
      var output = input.substring(4);
      for (var change in golos_changes) {
        output = output.replace(new RegExp(change, 'g'), golos_changes[change]);
      }
      return output.substring(0, 1).toUpperCase() + output.substring(1).toLowerCase();
    };
  });