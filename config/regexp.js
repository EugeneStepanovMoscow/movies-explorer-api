const regexConst = {
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
  langRu: /^[?!,.-а-яё0-9\s]+$/i,
  langEn: /^[?!,.-a-z0-9]+$/i,
};

module.exports = regexConst;