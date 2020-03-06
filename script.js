function showChilds() {
  for (let i = 0; i < document.body.childNodes.length; i++) {
    console.log(document.body.childNodes[i]);
  }
}

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
  // showChilds();
}

function changeLanguage() {
  const KEYBOARD_LANGUAGE = 'keyboardLanguage';
  const EN = 'english';
  const RU = 'русский';

  // make changes with localStorage
  switch (localStorage.getItem(KEYBOARD_LANGUAGE)) {
    case EN: localStorage.setItem(KEYBOARD_LANGUAGE, RU); break;
    case RU: localStorage.setItem(KEYBOARD_LANGUAGE, EN); break;
    default: localStorage.setItem(KEYBOARD_LANGUAGE, RU); break;
  }

  // make visual changes
  const buttonName = document.getElementsByClassName('btn')[0];
  buttonName.textContent = localStorage.getItem(KEYBOARD_LANGUAGE);

  const keys = document.getElementsByClassName('key');
  if (localStorage.getItem(KEYBOARD_LANGUAGE) === EN) {
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i].innerText.toLowerCase()) {
        case 'w': keys[i].innerText = 'ц'; break;
        default: break;
      }
      console.log(keys[i]);
    }
  } else {
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i].innerText.toLowerCase()) {
        case 'ц': keys[i].innerText = 'w'; break;
        default: break;
      }
      console.log(keys[i]);
    }
  }


  // console.log(keys);
}

function addSymbol(textarea, symbol) {
  textarea.value += symbol;
}

window.onload = () => {
  // clear local storage
  //localStorage.clear();

  createTree();

  const btn = document.createElement('button');
  btn.className = 'btn';
  btn.textContent = 'Change language';
  document.body.append(btn);

  const getBtn = document.getElementsByClassName('btn')[0];
  getBtn.addEventListener('click', changeLanguage);

  const btn2 = document.createElement('button');
  btn2.className = 'btn-W key';
  btn2.textContent = 'w';
  document.body.append(btn2);

  const textarea = document.getElementsByTagName('textarea')[0];
  const keyZ = document.getElementsByClassName('key');
  textarea.addEventListener('keydown', (e) => {
    console.log('НАЖАЛИ');
    console.log(e);

    if (e.repeat) return;

    for (let i = 0; i < keyZ.length; i++) {
      if (keyZ[i].innerText === e.key) {
        keyZ[i].classList.add('key-active');
        break;
      }
    }
    
  });

  textarea.addEventListener('keyup', (e) => {
    console.log('ОТПУСТИЛИ');
    console.log(e);

    // если отпустили - сбросить зажатие клавиши
    for (let i = 0; i < keyZ.length; i++) {
      if (keyZ[i].innerText === e.key) {
        keyZ[i].classList.remove('key-active');
        break;
      }
    }
  });

  const getBtn2 = document.getElementsByClassName('btn-W')[0];
  getBtn2.addEventListener('mousedown', (e) => {
    console.log(e);
  });

  getBtn2.addEventListener('click', (e) => {
    console.log(e);
    addSymbol(textarea, e.target.innerText);
  });


  // TODO: событие клика - сделать что-то once
  // TODO: событие mousedown - делать что-то many times
  // TODO: динамическая смена раскладки
};
