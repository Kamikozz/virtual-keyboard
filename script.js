const variables = {
  specialKeys: {
    ESC: 'Esc',
    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
    PRINT_SCREEN: 'Prtscr',
    SCROLL_LOCK: 'Scroll lock',
    PAUSE: 'Pause',
    INSERT: 'Insert',
    DELETE: 'Delete',
    PAGE_UP: 'Pgup',
    PAGE_DOWN: 'Pgdn',
    BACKSPACE: 'Backspace',
    NUM_LOCK: 'Num lock',
    TAB: 'Tab',
    CAPS_LOCK: 'Caps lock',
    ENTER: 'Enter',
    SHIFT: 'Shift',
    ARROW_UP: '↑',
    CTRL: 'Ctrl',
    FN: 'Fn',
    ALT: 'Alt',
    SPACE: '- -',
    ALTGR: 'Altgr',
    META: '',
    ARROW_LEFT: '←',
    ARROW_DOWN: '↓',
    ARROW_RIGHT: '→',
  },
  keys: null,
  mousedownFiredEvent: null, // store event object if mousedown fired at 'key' class
  languages: {
    EN: 'english',
    RU: 'русский',
  },
  KEYBOARD_LANGUAGE: 'keyboardLanguage',
};

variables.keys = {
  'row-k': [variables.specialKeys.ESC, variables.specialKeys.F1, variables.specialKeys.F2,
    variables.specialKeys.F3, variables.specialKeys.F4, variables.specialKeys.F5,
    variables.specialKeys.F6, variables.specialKeys.F7, variables.specialKeys.F8,
    variables.specialKeys.F9, variables.specialKeys.F10, variables.specialKeys.F11,
    variables.specialKeys.F12, variables.specialKeys.PRINT_SCREEN,
    variables.specialKeys.SCROLL_LOCK, variables.specialKeys.PAUSE, variables.specialKeys.INSERT,
    variables.specialKeys.DELETE, variables.specialKeys.PAGE_UP, variables.specialKeys.PAGE_DOWN],
  'row-e': ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
    variables.specialKeys.BACKSPACE, variables.specialKeys.NUM_LOCK, '/', '*', '-'],
  'row-d': [variables.specialKeys.TAB, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
    '\\', '7', '8', '9', '+'],
  'row-c': [variables.specialKeys.CAPS_LOCK, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'',
    variables.specialKeys.ENTER, '4', '5', '6'],
  'row-b': [variables.specialKeys.SHIFT, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
    variables.specialKeys.SHIFT, variables.specialKeys.ARROW_UP, '1', '2', '3',
    variables.specialKeys.ENTER],
  'row-a': [variables.specialKeys.CTRL, variables.specialKeys.FN, variables.specialKeys.ALT,
    variables.specialKeys.SPACE, '<', variables.specialKeys.ALTGR, variables.specialKeys.META,
    variables.specialKeys.CTRL, variables.specialKeys.ARROW_LEFT, variables.specialKeys.ARROW_DOWN,
    variables.specialKeys.ARROW_RIGHT, '0', '.'],
};

const classes = {
  TEXTAREA: 'textarea',
  KEY: 'key',
  KEYBOARD: 'keyboard',
  KEY_ACTIVE: 'key-active',
  KEY_UPPERCASE: 'key-uppercase',
  META_WIN: 'icon-windows-logo',
  META_OTHER: 'icon-other-logo',
  HIDDEN: 'hidden',
};

function getSymbolsArray(alphabet) {
  return [].concat(Object.keys(alphabet), Object.values(alphabet)).filter(
    (val) => val !== '`' && val !== '[' && val !== ']' && val !== ';' && val !== '\'' && val !== ','
    && val !== '.' && val !== '/',
  );
}

function getAlphabet(language) {
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
    case variables.languages.EN: {
      variables.layout = getSymbolsArray(languageEnglishRussian);
      return [languageEnglishRussian, numpadEnglishRussian];
    }
    case variables.languages.RU: {
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

      variables.layout = getSymbolsArray(languageRussianEnglish);
      return [languageRussianEnglish, numpadRussianEnglish];
    }
    default: {
      variables.layout = getSymbolsArray(languageEnglishRussian);
      return [languageEnglishRussian, numpadEnglishRussian];
    }
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
function changeKeysInnerText(alphabet, numpad, keyClassName = classes.KEY) {
  // TODO: fix bug with innerText
  // change symbols from english to russian, and backwards
  const numpadKeys = Object.keys(numpad);
  const numpadLength = numpadKeys ? numpadKeys.length : 0;

  // get array of keys with keyClassName
  const keys = [...document.getElementsByClassName(keyClassName)]
    .map((node) => node.firstElementChild);
  console.log('Hey', keys);

  // change innerText to all of the elements (except numpad)
  // TODO: удалить DELETE_ME, когда будет в продакшене
  const DELETE_ME = 1;

  for (let i = 0; i < keys.length - numpadLength - DELETE_ME; i += 1) {
    const translatedLetter = alphabet[keys[i].innerText.toLowerCase()];
    if (translatedLetter) keys[i].innerText = translatedLetter;
  }

  // change numpad elements innerText
  for (let i = keys.length - numpadLength; i < keys.length; i += 1) {
    const translatedLetter = numpad[keys[i]];
    if (translatedLetter) keys[i].innerText = translatedLetter;
  }
}

function isPlatformWindows() {
  return navigator.platform.toLowerCase().includes('win');
}

function createSection(className) {
  const section = document.createElement('section');
  if (arguments.length) section.className = className;

  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';

  section.append(wrapper);

  return section.children[0];
}

function createKeyboard() {
  const keyboard = document.createElement('div');
  keyboard.className = classes.KEYBOARD;
  keyboard.setAttribute(classes.HIDDEN, 'true');

  return keyboard;
}

function createTree() {
  const main = document.createElement('main');

  const sectionTextarea = createSection('section-textarea');
  const textarea = document.createElement(classes.TEXTAREA);
  textarea.setAttribute('placeholder',
    'There will be displayed everything that you enter on the keyboard...');
  sectionTextarea.append(textarea);

  const sectionKeyboard = createSection('section-keyboard');
  const keyboard = createKeyboard();
  sectionKeyboard.append(keyboard);

  const note = document.createElement('div');
  note.classList.add('section-keyboard__note');
  const textDeveloped = document.createElement('p');
  const textSwitchKeyboardLayout = document.createElement('p');
  textDeveloped.textContent = 'Developed on Microsoft© Windows.';
  textSwitchKeyboardLayout
    .textContent = 'CTRL + SHIFT; CTRL + ALT; SHIFT + ALT to switch keyboard layout.';

  note.append(textDeveloped);
  note.append(textSwitchKeyboardLayout);
  sectionKeyboard.append(note);

  main.append(sectionTextarea.parentElement);
  main.append(sectionKeyboard.parentElement);

  const returnObject = {
    textarea,
    keys: [],
    'row-k': null,
    'row-e': null,
    'row-d': null,
    'row-c': null,
    'row-b': null,
    'row-a': null,
    keyboard,
  };

  const rows = Object.keys(variables.keys);
  rows.forEach((rowClass) => {
    const row = document.createElement('div');
    row.classList.add(rowClass);

    variables.keys[rowClass].forEach((text) => {
      const span = document.createElement('span');
      span.textContent = text;

      const key = document.createElement('div');
      key.classList.add(classes.KEY);
      key.append(span);

      row.append(key);

      returnObject.keys.push(key); // get array of keys 'key'
    });

    keyboard.append(row);
    returnObject[rowClass] = row;
  });

  // apply icon-windows-logo or icon-apple-logo
  const keysRowA = returnObject['row-a'].children;
  for (let i = 0; i < keysRowA.length; i += 1) {
    const key = keysRowA[i].firstElementChild;
    if (key.textContent === '') {
      key.classList.add(isPlatformWindows() ? classes.META_WIN : classes.META_OTHER);
      break;
    }
  }

  // console.log(main);

  document.body.append(main);

  return returnObject;
}

const elements = createTree();

/**
 * Invokes when window.onLoad() & gets the stored value in KEYBOARD_LANGUAGE
 * & sets the current language of the keyboard, unhides the 'keyboard' class.
 */
function initLanguageFromStorage() {
  switch (localStorage.getItem(variables.KEYBOARD_LANGUAGE)) {
    case variables.languages.RU: {
      // change default english innerText to russian
      const [alphabet, numpad] = getAlphabet(variables.languages.EN);
      changeKeysInnerText(alphabet, numpad);
      break;
    }
    case variables.languages.EN: {
      getAlphabet(variables.languages.EN);
      break;
    }
    default: {
      getAlphabet(variables.languages.EN);
      break;
    }
  }
  // unhide the whole keyboard
  elements.keyboard.toggleAttribute(classes.HIDDEN);
}

/**
 * Changes the language stored in localStorage to the opposite.
 * Changes button's with className 'btn' innerText with name of the language.
 * Changes keys' innerText to the opposite
 */
function changeLanguage() {
  // make changes with localStorage
  // and get source alphabet pair map {'en':'ru'} or {'ru':'en'}
  let alphabet;
  let numpad;
  switch (localStorage.getItem(variables.KEYBOARD_LANGUAGE)) {
    case variables.languages.RU:
      localStorage.setItem(variables.KEYBOARD_LANGUAGE, variables.languages.EN);
      [alphabet, numpad] = getAlphabet(variables.languages.RU);
      break;
    case variables.languages.EN:
    default:
      localStorage.setItem(variables.KEYBOARD_LANGUAGE, variables.languages.RU);
      [alphabet, numpad] = getAlphabet(variables.languages.EN);
      break;
  }

  // // make visual changes into button
  // const buttonName = document.getElementsByClassName('btn')[0];
  // buttonName.innerText = localStorage.getItem(KEYBOARD_LANGUAGE);

  // change symbols from english to russian, and backwards
  changeKeysInnerText(alphabet, numpad);
}

// FIXME: не подсвечивает смена case буквы на клавиатуре SHIFT/CAPSLOCK
function changeCase() {
  console.log('Before upper/lower case', elements.keys);
  console.log(variables.layout);
  elements.keys.forEach((key) => {
    const innerElement = key.firstElementChild;
    const text = innerElement.textContent.toLowerCase();
    if (variables.layout.includes(text)) {
      // if ()
      if (key.classList.contains(classes.KEY_UPPERCASE)) {
        key.classList.remove(classes.KEY_UPPERCASE);
        innerElement.textContent = text;
      } else {
        key.classList.add(classes.KEY_UPPERCASE);
        innerElement.textContent = text.toUpperCase();
      }
      // key.firstElementChild.textContent.toLowerCase();
      // key.classList.toggle(classes.KEY_UPPERCASE);
    }
  });
}

function playKeypressSound() {
  const audio = new Audio('assets/sound/key-press.mp3');
  audio.play();
}

// //////////////////////////////////
initLanguageFromStorage(); // set language from storage init

function handlerKeyInput(elem, event) {
  if (!elem) return;

  const text = elements.textarea;
  text.focus();

  // event.preventDefault();
  const el = elem.firstElementChild;
  switch (el.innerText) {
    case variables.specialKeys.ESC: case variables.specialKeys.F1: case variables.specialKeys.F2:
    case variables.specialKeys.F3: case variables.specialKeys.F4: case variables.specialKeys.F6:
    case variables.specialKeys.F7: case variables.specialKeys.F8: case variables.specialKeys.F9:
    case variables.specialKeys.F10: case variables.specialKeys.F12:
    case variables.specialKeys.PRINT_SCREEN: case variables.specialKeys.SCROLL_LOCK:
    case variables.specialKeys.PAUSE: case variables.specialKeys.INSERT:
    case variables.specialKeys.NUM_LOCK: case variables.specialKeys.CTRL:
    case variables.specialKeys.FN: case variables.specialKeys.ALT: case variables.specialKeys.ALTGR:
    case variables.specialKeys.ARROW_UP: case variables.specialKeys.ARROW_DOWN:
      break;
    case variables.specialKeys.F5: {
      document.location.reload();
      break;
    }
    case variables.specialKeys.F11: {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
      break;
    }
    case variables.specialKeys.DELETE: {
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
    case variables.specialKeys.PAGE_UP: {
      const fixOffset = 110;
      const offset = document.documentElement.clientHeight - fixOffset;
      window.scrollBy(0, -offset);
      break;
    }
    case variables.specialKeys.PAGE_DOWN: {
      const fixOffset = 110;
      const offset = document.documentElement.clientHeight - fixOffset;
      window.scrollBy(0, +offset);
      break;
    }
    case variables.specialKeys.BACKSPACE: {
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
    case variables.specialKeys.TAB: {
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
    case variables.specialKeys.CAPS_LOCK: {
      changeCase(elements.keys, variables.specialKeys.CAPS_LOCK);
      break;
    }
    case variables.specialKeys.SHIFT: {
      changeCase(elements.keys, variables.specialKeys.SHIFT);
      break;
    }
    case variables.specialKeys.ENTER: {
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
    case variables.specialKeys.SPACE: {
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
    case variables.specialKeys.ARROW_LEFT: {
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
    case variables.specialKeys.ARROW_RIGHT: {
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
}

// ///////////////////////// KEYBOARD HANDLERS ///////////////////////////
const handlerKeyDown = (e) => {
  console.log('НАЖАЛИ:', e);

  e.preventDefault(); // TODO: DELETE THIS IN THE FUTURE();

  if (e.repeat) return;

  playKeypressSound();

  switch (e.key) {
    case 'CapsLock':
      changeCase(elements.keys, e, variables.specialKeys.CAPS_LOCK);
      break;
    case variables.specialKeys.SHIFT:
    // TODO: toUpperCase() or toLowerCase()
      changeCase(elements.keys, e, variables.specialKeys.SHIFT);
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
      elements.keys[i].classList.add(classes.KEY_ACTIVE);
      break;
    } else if ((elements.keys[i].innerText === variables.specialKeys.ESC && e.key === 'Escape')
      || (elements.keys[i].innerText === variables.specialKeys.CTRL && e.code === 'ControlLeft')
      || (elements.keys[i].innerText === variables.specialKeys.CTRL && e.code === 'ControlRight')
      || (elements.keys[i].innerText === variables.specialKeys.ALT && e.code === 'AltLeft')
      || (elements.keys[i].innerText === variables.specialKeys.ALTGR && e.code === 'AltRight')
      || (elements.keys[i].innerText === variables.specialKeys.SPACE && e.code === 'Space')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_UP && e.code === 'ArrowUp')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_DOWN && e.code === 'ArrowDown')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_LEFT && e.code === 'ArrowLeft')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_RIGHT && e.code === 'ArrowRight')
      || (elements.keys[i].innerText === variables.specialKeys.PAGE_UP && e.code === 'PageUp')
      || (elements.keys[i].innerText === variables.specialKeys.PAGE_DOWN && e.code === 'PageDown')) {
      elements.keys[i].classList.add(classes.KEY_ACTIVE);
      break;
    } else if ((elements.keys[i].innerText === variables.specialKeys.CAPS_LOCK
        && e.key === 'CapsLock')
      || (elements.keys[i].innerText === variables.specialKeys.NUM_LOCK && e.key === 'NumLock')) {
      if (elements.keys[i].classList.contains(classes.KEY_ACTIVE)) {
        elements.keys[i].classList.remove(classes.KEY_ACTIVE);
      } else {
        elements.keys[i].classList.add(classes.KEY_ACTIVE);
      }
      break;
    }
  }

  for (let i = 0; i < elements.keys.length; i += 1) {
    if (elements.keys[i].innerText === variables.specialKeys.TAB) {
      // console.log(elements.keys[i], e);
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

  if (e.key === variables.specialKeys.SHIFT) {
    changeCase();
  }

  // если отпустили - сбросить зажатие клавиши
  for (let i = 0; i < elements.keys.length; i += 1) {
    if (elements.keys[i].innerText === e.key) {
      elements.keys[i].classList.remove(classes.KEY_ACTIVE);
      break;
    } else if ((elements.keys[i].innerText === variables.specialKeys.ESC && e.key === 'Escape')
      || (elements.keys[i].innerText === variables.specialKeys.CTRL && e.code === 'ControlLeft')
      || (elements.keys[i].innerText === variables.specialKeys.CTRL && e.code === 'ControlRight')
      || (elements.keys[i].innerText === variables.specialKeys.ALT && e.code === 'AltLeft')
      || (elements.keys[i].innerText === variables.specialKeys.ALTGR && e.code === 'AltRight')
      || (elements.keys[i].innerText === variables.specialKeys.SPACE && e.code === 'Space')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_UP && e.code === 'ArrowUp')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_DOWN && e.code === 'ArrowDown')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_LEFT && e.code === 'ArrowLeft')
      || (elements.keys[i].innerText === variables.specialKeys.ARROW_RIGHT && e.code === 'ArrowRight')
      || (elements.keys[i].innerText === variables.specialKeys.PAGE_UP && e.code === 'PageUp')
      || (elements.keys[i].innerText === variables.specialKeys.PAGE_DOWN && e.code === 'PageDown')) {
      elements.keys[i].classList.remove(classes.KEY_ACTIVE);
      break;
    }
  }
};

// ///////////////////////// MOUSE HANDLERS ///////////////////////////
// TODO: событие клика - сделать что-то once
// TODO: событие mousedown - делать что-то many times
// TODO: динамическая смена раскладки
const handlerMouseDown = (e) => {
  // find div.key
  let target;
  if (e.target.classList.contains(classes.KEY)) {
    target = e.target;
  } else if (!e.target.children.length) {
    target = e.target.parentElement;
  }
  // store this node as a fired mousedown event to the future removal
  variables.mousedownFiredEvent = target;

  // make UI effects if event exists
  if (target) {
    playKeypressSound();

    if (target.firstElementChild.innerText === variables.specialKeys.SHIFT) {
      elements.keys.forEach((val) => {
        if (val.firstElementChild.innerText === variables.specialKeys.SHIFT) {
          val.classList.toggle(classes.KEY_ACTIVE);
        }
      });
    } else {
      target.classList.toggle(classes.KEY_ACTIVE);
    }
  }

  // key input handler
  handlerKeyInput(target, e);
};

const handlerMouseUp = (e) => {
  if (!variables.mousedownFiredEvent) return;

  const text = variables.mousedownFiredEvent.firstElementChild.innerText;
  if (text === variables.specialKeys.CAPS_LOCK
    || text === variables.specialKeys.NUM_LOCK
    || text === variables.specialKeys.SHIFT) return;

  variables.mousedownFiredEvent.classList.remove(classes.KEY_ACTIVE);
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

// TODO: (НЕВАЖНА) Значок Win менять на Яблоко в MacOS (и красить в белый цвет через inline-svg)
// TODO: зажали клавиши и потеряли фокус с браузера на что-то кроме (хз, не фиксится)
// FIXME: много повторных нажатий клавиш генерируют звук, фу
