var golos_changes = {
  'shch': 'щ',
  'yie': 'ые',
  'yo': 'ё',
  'zh': 'ж',
  'ij': 'й',
  'kh': 'х',
  'cz': 'ц',
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
  'c': 'с',
  's': 'с',
  't': 'т',
  'u': 'у',
  'f': 'ф',
  'x': 'ь',
  'y': 'ы'
};

//    rus = "щ    ш  ч  ц  й  ё  э  ю  я  х  ж  а б в г д е з и к л м н о п р с т у ф ъ  ы ь ґ є і ї".split(d), используются ли в тегах украинские буквы?
//    eng = "shch sh ch cz ij yo ye yu ya kh zh a b v g d e z i k l m n o p r s t u f xx y x g e i i".split(d);

angular.module('oneplace')
  .filter('golos', function () {

    return function (input) {
      if (input.substring(0,4) != 'ru--') {
        return input;
      }
      var output = input.substring(4);
      for (var change in golos_changes) {
        output = output.replace(new RegExp(change, 'g'), golos_changes[change]);
      }
      return output;
    };
  });