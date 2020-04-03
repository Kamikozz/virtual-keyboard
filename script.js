function createSection(className) {
  const section = document.createElement('section');
  if (arguments.length) section.className = className;

  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  section.append(wrapper);

  console.log('Created new section');
  return section.children[0];
}

// must be <input> where we must enter the symbols
function createInput() {
  const textarea = document.createElement('textarea');

  console.log('Created new input');
  return textarea;
}

function createKeyboard() {
  const keyboard = document.createElement('div');
  keyboard.className = 'keyboard';
  // keyboard.setAttribute('hidden', 'true');
  // keyboard.setAttribute('hidden');

  console.log('Created new keyboard');
  return keyboard;
}

function createTree() {
  const main = document.createElement('main');

  const sectionTextarea = createSection('section-textarea');
  const textarea = createInput();
  sectionTextarea.append(textarea);

  const sectionKeyboard = createSection('section-keyboard');
  const keyboard = createKeyboard();
  sectionKeyboard.append(keyboard);

  main.append(sectionTextarea.parentElement);
  main.append(sectionKeyboard.parentElement);

  console.log(main);

  document.body.append(main);
}

function getAlphabet(language) {
  const EN = 'english';
  const RU = 'русский';

  const languageEnglishRussian = {
    '`': 'ё',
    q: 'й',
    w: 'ц',
    e: 'у',
    r: 'к',
    t: 'е',
    y: 'н',
    u: 'г',
    i: 'ш',
    o: 'щ',
    p: 'з',
    '[': 'х',
    ']': 'ъ',
    a: 'ф',
    s: 'ы',
    d: 'в',
    f: 'а',
    g: 'п',
    h: 'р',
    j: 'о',
    k: 'л',
    l: 'д',
    ';': 'ж',
    '\'': 'э',
    z: 'я',
    x: 'ч',
    c: 'с',
    v: 'м',
    b: 'и',
    n: 'т',
    m: 'ь',
    ',': 'б',
    '.': 'ю',
    '/': '.',
  };
  const numpadEnglishRussian = {
    '.': ',',
  };

  switch (language) {
    case EN:
      return [languageEnglishRussian, numpadEnglishRussian];
    case RU: {
      const languageRussianEnglish = {};
      Object.keys(languageEnglishRussian).forEach((key) => {
        // languageEnglishRussian[key] = value -> langRusEng[value] = key;
        languageRussianEnglish[languageEnglishRussian[key]] = key;
      });

      const numpadRussianEnglish = {};
      Object.keys(numpadEnglishRussian).forEach((key) => {
        // languageEnglishRussian[key] = value -> langRusEng[value] = key;
        numpadRussianEnglish[numpadEnglishRussian[key]] = key;
      });
      return [languageRussianEnglish, numpadRussianEnglish];
    }
    default: return [languageEnglishRussian, numpadEnglishRussian];
  }
}

/**
 * Gives 2 objects and optional keyClassName, gets all of the HTMLElements
 * with the given keyClassName and changes their innerText
 * according to alphabet & numpad.
 * @param {Object} alphabet map with key/value of the main keys on keyboard
 * @param {Object} numpad map with key/value of the numpad keys on keyboard
 * @param {string} keyClassName string with the name of the class of keys
 */
function changeKeysInnerText(alphabet, numpad, keyClassName = 'key') {
  // TODO: fix bug with innerText
  // change symbols from english to russian, and backwards
  const numpadKeys = Object.keys(numpad);
  const numpadLength = numpadKeys ? numpadKeys.length : 0;

  // get array of keys with keyClassName
  let keys = document.getElementsByClassName(keyClassName);
  keys = Array.prototype.map.call(keys, (node) => node.children[0]);
  console.log(keys);


  // change innerText to all of the elements (except numpad)
  // TODO: удалить DELETE_ME, когда будет в продакшене
  const DELETE_ME = 1;

  for (let i = 0; i < keys.length - numpadLength - DELETE_ME; i++) {
    const translatedLetter = alphabet[keys[i].innerText.toLowerCase()];
    if (translatedLetter) keys[i].innerText = translatedLetter;
  }

  // change numpad elements innerText
  for (let i = keys.length - numpadLength; i < keys.length; i++) {
    const translatedLetter = numpad[keys[i]];
    if (translatedLetter) keys[i].innerText = translatedLetter;
  }
}

/**
 * Invokes when window.onLoad() & gets the stored value in KEYBOARD_LANGUAGE
 * & sets the current language of the keyboard, unhides the 'keyboard' class.
 */
function initLanguageFromStorage() {
  const KEYBOARD_LANGUAGE = 'keyboardLanguage';
  const EN = 'english';
  const RU = 'русский';

  switch (localStorage.getItem(KEYBOARD_LANGUAGE)) {
    case RU: {
      // change default english innerText to russian
      const [alphabet, numpad] = getAlphabet(EN);
      changeKeysInnerText(alphabet, numpad);
      break;
    }
    case EN:
    default: break;
  }
  // unhide the whole keyboard
  document.getElementsByClassName('keyboard')[0].toggleAttribute('hidden');
}


/**
 * Changes the language stored in localStorage to the opposite.
 * Changes button's with className 'btn' innerText with name of the language.
 * Changes keys' innerText to the opposite
 */
function changeLanguage() {
  const KEYBOARD_LANGUAGE = 'keyboardLanguage';
  const EN = 'english';
  const RU = 'русский';

  // make changes with localStorage
  // and get source alphabet pair map {'en':'ru'} or {'ru':'en'}
  let alphabet;
  let numpad;
  switch (localStorage.getItem(KEYBOARD_LANGUAGE)) {
    case RU:
      localStorage.setItem(KEYBOARD_LANGUAGE, EN);
      [alphabet, numpad] = getAlphabet(RU);
      break;
    case EN:
    default:
      localStorage.setItem(KEYBOARD_LANGUAGE, RU);
      [alphabet, numpad] = getAlphabet(EN);
      break;
  }

  // // make visual changes into button
  // const buttonName = document.getElementsByClassName('btn')[0];
  // buttonName.innerText = localStorage.getItem(KEYBOARD_LANGUAGE);

  // change symbols from english to russian, and backwards
  changeKeysInnerText(alphabet, numpad);
}

function changeCase() {
  console.log('lol');
}

function handlerKeyInput(elem, event, textarea) {
  if (!elem) return;

  const text = textarea;
  text.focus();

  // event.preventDefault();

  const el = elem.children[0];
  switch (el.innerText) {
    case 'Esc': case 'F1': case 'F2': case 'F3': case 'F4': case 'F6':
    case 'F7': case 'F8': case 'F9': case 'F10': case 'F12':
    case 'Prtscr': case 'Scroll lock': case 'Pause': case 'Insert':
    case 'Num lock': case 'Ctrl': case 'Fn':
    case 'Alt': case 'Altgr': case '↑': case '↓':
      break;
    case 'F5':
      document.location.reload();
      break;
    case 'F11': {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
      break;
    }
    case 'Delete': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;
      const len = 1;

      if (start !== end) {
        // if selection presents -> cut between start & end
        const strBefore = text.value.substring(0, start);
        const strAfter = text.value.substring(end);

        // set textarea value to: text before caret + text after caret
        text.value = `${strBefore}${strAfter}`;

        // put caret at right position
        text.selectionEnd = start;
      } else if (end !== text.value.length) {
        const strBefore = text.value.substring(0, start);
        const strAfter = text.value.substring(end + len);

        // set textarea value to: text before caret + text after caret
        text.value = `${strBefore}${strAfter}`;

        // put caret at right position
        text.selectionEnd = start;
      }
      break;
    }
    case 'Pgup': {
      const fixOffset = 110;
      const offset = document.documentElement.clientHeight - fixOffset;
      window.scrollBy(0, -offset);
      break;
    }
    case 'Pgdn': {
      const fixOffset = 110;
      const offset = document.documentElement.clientHeight - fixOffset;
      window.scrollBy(0, +offset);
      break;
    }
    case 'Backspace': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;
      const len = 1;

      if (start !== end) {
        const strBefore = text.value.substring(0, start);
        const strAfter = text.value.substring(end);

        // set textarea value to: text before caret + text after caret
        text.value = `${strBefore}${strAfter}`;

        // put caret at right position
        text.selectionEnd = start;
      } else if (start !== 0) {
        const strBefore = text.value.substring(0, start - len);
        const strAfter = text.value.substring(end);

        // set textarea value to: text before caret + text after caret
        text.value = `${strBefore}${strAfter}`;

        // put caret at right position
        text.selectionStart = start - len;
        text.selectionEnd = text.selectionStart;
      }
      break;
    }
    case 'Tab': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      const strBefore = text.value.substring(0, start);
      const strAfter = text.value.substring(end);
      const tab = '\t';

      // set textarea value to: text before caret + tab + text after caret
      text.value = `${strBefore}${tab}${strAfter}`;

      // put caret at right position
      text.selectionStart = start + tab.length;
      text.selectionEnd = text.selectionStart;
      break;
    }
    case 'Caps lock':
      // TODO: changeCase
      //changeCase(keyZ, e, 'Caps lock');
      break;
    case 'Shift':
      // TODO: changeCase
      //changeCase(keyZ, e, 'Caps lock');
      break;
    case 'Enter': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      const strBefore = text.value.substring(0, start);
      const strAfter = text.value.substring(end);
      const newline = '\n';

      // set textarea value to: text before caret + newline + text after caret
      text.value = `${strBefore}${newline}${strAfter}`;

      // put caret at right position
      text.selectionStart = start + newline.length;
      text.selectionEnd = text.selectionStart;
      break;
    }
    case '- -': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      const strBefore = text.value.substring(0, start);
      const strAfter = text.value.substring(end);
      const symbol = ' ';

      // set textarea value to: text before caret + tab + text after caret
      text.value = `${strBefore}${symbol}${strAfter}`;

      // put caret at right position
      text.selectionStart = start + symbol.length;
      text.selectionEnd = text.selectionStart;
      break;
    }
    case '<': {
      // TODO: \| <
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      const strBefore = text.value.substring(0, start);
      const strAfter = text.value.substring(end);
      const symbol = '\\';

      // set textarea value to: text before caret + tab + text after caret
      text.value = `${strBefore}${symbol}${strAfter}`;

      // put caret at right position
      text.selectionStart = start + symbol.length;
      text.selectionEnd = text.selectionStart;
      break;
    }
    case '←': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      // check if selection presents
      if (start !== end) {
        // remove selection
        text.selectionEnd = text.selectionStart;
      } else if (start !== 0) {
        // handle out of left boundaries
        text.selectionStart = start - 1;
        text.selectionEnd = text.selectionStart;
      }
      break;
    }
    case '→': {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      // check if selection presents
      if (start !== end) {
        // remove selection
        text.selectionStart = text.selectionEnd;
      } else if (end !== text.value.length) {
        // handle out of right boundaries
        text.selectionStart = start + 1;
        text.selectionEnd = text.selectionStart;
      }
      break;
    }
    default: {
      event.preventDefault();
      const start = text.selectionStart;
      const end = text.selectionEnd;

      const strBefore = text.value.substring(0, start);
      const strAfter = text.value.substring(end);
      const symbol = el.innerText;

      // set textarea value to: text before caret + tab + text after caret
      text.value = `${strBefore}${symbol}${strAfter}`;

      // put caret at right position
      text.selectionStart = start + symbol.length;
      text.selectionEnd = text.selectionStart;
      console.log(text.selectionStart, text.selectionEnd);
      break;
    }
  }
  console.log(el);
}

function playKeypressSound() {
  const audio = new Audio('assets/sound/key-press.mp3');
  audio.play();
}

// function init() {
//   // clear local storage
//   // localStorage.clear();

//   createTree();
// }

function initElements() {
  // const textarea = document.getElementsByTagName('textarea')[0];

  // // get array of keys 'key'
  // const keys = [...document.getElementsByClassName('key')];
  // console.log(keys);
  // TODO: children - возвращает массив, следовательно надо как-то эт массив сломать
  // если будет бага, то вернуть node.children с node.children[0]
  // const keyZ = Array.prototype.map.call(keys, (node) => node.children[0]);
  // const keyZ = [...keys];
  // console.log(keyZ);

  // const keyboard = document.getElementsByClassName('keyboard')[0];
  return {
    textarea: document.getElementsByTagName('textarea')[0],
    keys: [...document.getElementsByClassName('key')], // get array of keys 'key'
    keyboard: document.getElementsByClassName('keyboard')[0],
  };
}

function initTempVars() {
  return {
    mousedownFiredEvent: null, // store event object if mousedown fired at 'key' class
  };
}

// //////////////////////////////////
// clear local storage
// localStorage.clear();

createTree();

const elements = initElements();
const tempVars = initTempVars();

initLanguageFromStorage(); // set language from storage init

// ///////////////////////// KEYBOARD HANDLERS ///////////////////////////
const handlerKeyDown = (e) => {
  console.log('НАЖАЛИ:', e);

  // e.preventDefault(); // TODO: DELETE THIS IN THE FUTURE();

  if (e.repeat) return;

  playKeypressSound();

  switch (e.key) {
    case 'CapsLock':
      changeCase(elements.keys, e, 'Caps lock');
      break;
    case 'Shift':
    // TODO: toUpperCase() or toLowerCase()
      changeCase(elements.keys, e, 'Shift');
      break;
    default: break;
  }

  if ((e.ctrlKey && e.shiftKey)
    || (e.ctrlKey && e.altKey)
    || (e.shiftKey && e.altKey)) {
    changeLanguage();
  }

  elements.textarea.focus();

  for (let i = 0; i < elements.keys.length; i += 1) {
    if (elements.keys[i].innerText === e.key) {
      elements.keys[i].classList.add('key-active');
      break;
    } else if ((elements.keys[i].innerText === 'Esc' && e.key === 'Escape')
      || (elements.keys[i].innerText === 'Ctrl' && e.code === 'ControlLeft')
      || (elements.keys[i].innerText === 'Ctrl' && e.code === 'ControlRight')
      || (elements.keys[i].innerText === 'Alt' && e.code === 'AltLeft')
      || (elements.keys[i].innerText === 'Altgr' && e.code === 'AltRight')) {
      elements.keys[i].classList.add('key-active');
      break;
    } else if (
      (elements.keys[i].innerText === 'Caps lock' && e.key === 'CapsLock')
      || (elements.keys[i].innerText === 'Num lock' && e.key === 'NumLock')) {
      if (elements.keys[i].classList.value.indexOf('key-active') !== -1) {
        // if 'key-active' is present then delete it
        elements.keys[i].classList.remove('key-active');
      } else {
        elements.keys[i].classList.add('key-active');
      }
      break;
    }
  }

  for (let i = 0; i < elements.keys.length; i += 1) {
    if (elements.keys[i].innerText === 'Tab') {
      console.log(elements.keys[i], e);
      // handlerKeyInput(keyZ[i], e, textarea);
      break;
    }
  }
};
const handlerKeyUp = (e) => {
  console.log('ОТПУСТИЛИ:', e);

  // if (e.repeat) return;
  if (e.code === 'CapsLock') {
    return;
  }

  // если отпустили - сбросить зажатие клавиши
  for (let i = 0; i < elements.keys.length; i += 1) {
    if (elements.keys[i].innerText === e.key) {
      elements.keys[i].classList.remove('key-active');
      break;
    } else if ((elements.keys[i].innerText === 'Esc' && e.key === 'Escape')
      || (elements.keys[i].innerText === 'Ctrl' && e.code === 'ControlLeft')
      || (elements.keys[i].innerText === 'Ctrl' && e.code === 'ControlRight')
      || (elements.keys[i].innerText === 'Alt' && e.code === 'AltLeft')
      || (elements.keys[i].innerText === 'Altgr' && e.code === 'AltRight')) {
      elements.keys[i].classList.remove('key-active');
      break;
    }
  }
};

// ///////////////////////// MOUSE HANDLERS ///////////////////////////
// TODO: событие клика - сделать что-то once
// TODO: событие mousedown - делать что-то many times
// TODO: динамическая смена раскладки
const handlerMouseDown = (e) => {
  // console.log(e);

  // find div.key
  let target;
  if (e.target.classList.value.indexOf('key') !== -1) {
    // if exists then check if it's exactly 'key' not 'keyboard'
    for (let i = 0; i < e.target.classList.length; i += 1) {
      if (e.target.classList[i] === 'key') { target = e.target; break; }
    }
  } else if (!e.target.children.length) {
    target = e.target.parentElement;
  }
  // store this node as a fired mousedown event to the future removal
  tempVars.mousedownFiredEvent = target;

  // make UI effects if event exists
  if (target) {
    playKeypressSound();
    target.classList.add('key-active');
  }


  // key input handler
  handlerKeyInput(target, e, elements.textarea);
};
const handlerMouseUp = (e) => {
  console.log('mouseup at DOCUMENT', e);
  // if mousedown above any of the 'key' class
  if (tempVars.mousedownFiredEvent) {
    tempVars.mousedownFiredEvent.classList.remove('key-active');
  }
};

function initHandlers() {
  // ///////////////////////// KEYBOARD HANDLERS ///////////////////////////
  document.body.addEventListener('keydown', handlerKeyDown);
  document.body.addEventListener('keyup', handlerKeyUp);

  // ///////////////////////// MOUSE HANDLERS ///////////////////////////
  elements.keyboard.addEventListener('mousedown', handlerMouseDown);
  document.addEventListener('mouseup', handlerMouseUp);
}

initHandlers();

// FIXME: физический TAB не даёт нужного результата, как событие по клику на кнопке TAB (нужен preventDefault)
// TODO: смотреть на User Agent, если он связан с Mac OS => делать кнопки как у Mac, иначе как у Windows
// TODO: некоторые символы генерируют вместо \ - значок параграфа (в виртуалке, на MacOS)
// TODO: теряется фокус с textarea при нажатии на Alt (но в виртуалке не теряется)
// TODO: (НЕВАЖНА) RightControl в Windows работает, в MacOS/VM - нет
// TODO: (НЕВАЖНА) Fullscreen в Safari не работает
// TODO: реализовать HOME & END (fn)

// FIXME: indexof -> includes
// TODO: Значок Win менять на Яблоко в MacOS (и красить в белый цвет через inline-svg)
// TODO: зажали клавиши и потеряли фокус с браузера на что-то кроме (хз, не фиксится)
// FIXME: много повторных нажатий клавиш генерируют звук, фу