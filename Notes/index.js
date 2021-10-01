//Html Elements
const container = document.querySelector('.container'),
      preloader = document.querySelector('.preloader'),
      root = document.querySelector('.root'),
      navcont = document.querySelector('.nav-cont'),
      nav = document.querySelector('.nav'),
      textarea = document.querySelector('.textarea'),
      themebtn = document.getElementById('themebtn'),
      savebtn = document.querySelector('.save');
      
// State
let { Notes, Theme, EnterSend } = {
  Notes: [],
  Theme: false,
  EnterSend: false,
  NewNote: ''
};

// Local Storage Keys
const NOTES_KEY = 'Notes',
      THEME_KEY = 'Theme',
      ENTERSEND_KEY = 'EnterSend',
      NEWNOTE_KEY = 'NewNote',
      REMOVE = 'remove',
      ADD = 'add';

const RegPattern = /^\s*$/g;
let IsNote = true;
let InputHeight = 0;

function SetLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
  
function GetData() {
  function LocalCheck(key, value) {
    const savedvalue = localStorage.getItem(key);
    if (savedvalue === null) {
      SetLocal(key, value);
      return value;
    }else return JSON.parse(savedvalue);
  }
  Notes = LocalCheck(NOTES_KEY, []);
  Theme = LocalCheck(THEME_KEY, true);
  EnterSend = LocalCheck(ENTERSEND_KEY, true);
  NewNote = LocalCheck(NEWNOTE_KEY, '');
}

function NoteHtml(item, num) {
  return `
    <div class="notes">
      <button onclick="HandleEdit(event, ${item.id})" class="delete edit ${item.completed ? 'completed':''}">
      ${item.completed ? '&times;':'&check;'}
      </button>
      <p>
      ${item.body.map((line) => {
        return `
          <span class="line">
            ${line == '' ? '<br />' : line }
          </span>`;
      }).join('')}
      </p>
      <button onclick="HandleDelete(event, ${item.id})" class="delete">&times;</button>
    </div>
  `
}

function UpdateHtml() {
  const Html = Notes.map((item, index) => {
    return NoteHtml(item, index + 1);
  }).join('');
  container.innerHTML = Html;
}

function HandleClass(method, elmnt, className) {
  switch (method) {
    case REMOVE : elmnt.classList.remove(className);
         break; 
    case ADD : elmnt.classList.add(className);
         break;
  }
}

function UpdateTheme() {
  if (Theme) HandleClass(REMOVE,root,'dark');
  else HandleClass(ADD,root,'dark');
  themebtn.innerText = `${Theme ? 'Dark' : 'Light'} Theme`;
}

function UpdateInputHeight() {
  textarea.style.height = '25px';
  textarea.style.height = textarea.scrollHeight + 'px';
  textarea.style.overflowY = (textarea.scrollHeight < 145) ? 'hidden' : 'auto';
  InputHeight = textarea.scrollHeight;

}

function Start() {
  GetData();
  UpdateTheme();
  UpdateHtml();
  textarea.value = NewNote;
  UpdateInputHeight();
  preloader.style.display = 'none';
}

Start();

let NavDisplay = 'none';

function ValidateInput() {
  if (textarea.value.match(RegPattern))
  {
    if (IsNote) {
      IsNote = false;
      HandleClass(ADD, savebtn, 'nosave');
      HandleClass(ADD, textarea, 'notextarea');
    }else return;
  } else {
    if (!IsNote) {
      IsNote = true;
      HandleClass(REMOVE, savebtn, 'nosave');
      HandleClass(REMOVE, textarea, 'notextarea');
    }else return;
  }
}
ValidateInput();

function CheckEnterKey() {
  let i = 0;
  let j = 0;
  let difference = "";
  while (j < textarea.value.length) {
    if (NewNote[i] !== textarea.value[j] || i === NewNote.length) difference += textarea.value[j];
    else i++;
    j++;
  }
  return difference === '\n';
}

function HandleNewNote() {
  ValidateInput();
  
  // Check for Enter Key
  if (EnterSend) { 
    if (CheckEnterKey()) {
      NewNote = textarea.value;
      AddNote();
    }
  }
  // Update State
  NewNote = textarea.value;
  SetLocal(NEWNOTE_KEY, textarea.value);
  
  // Update Input Size
  if (textarea.scrollHeight !== InputHeight) UpdateInputHeight();
}


function HandleNav() {
  NavDisplay = NavDisplay === 'none' ? 'block' : 'none';
  navcont.style.display = NavDisplay;
  nav.style.display = NavDisplay;
}

function HandleTheme() {
  Theme = !Theme;
  UpdateTheme();
  SetLocal(THEME_KEY,Theme);
}

function RemoveAll() {
  if (confirm('Delete All Notes')) {
    Notes = [];
    SetLocal(NOTES_KEY, Notes);
    UpdateHtml();
  }
}

function HandleEnterSend() {
  if (confirm(`Enter Key Will${EnterSend ? ' Not' : ''} Save Your Note`)) {
    EnterSend = !EnterSend;
    SetLocal(ENTERSEND_KEY, EnterSend);
  }
}

function HandleDelete(e, id) {
  const item = e.target.parentNode;
  HandleClass(ADD,item,'delete-anim');
  setTimeout(() => {
    item.remove();
  },300)
  Notes = Notes.filter(i => i.id !== id);
  SetLocal(NOTES_KEY, Notes);
}

function HandleEdit(e, id) {
  const item = Notes.find(i => i.id === id);
  HandleClass(item.completed ? REMOVE : ADD,e.target,'completed');
  e.target.innerHTML = item.completed ? '&check;' : '&times;';
  item.completed = !item.completed;
  SetLocal(NOTES_KEY,Notes);
}

function AddNote() {
  if (!IsNote) return;
  Notes = [{
      id: new Date().getTime(),
      body: NewNote.trim().split(/\n/g),
      completed: false
    } , ...Notes]
  container.insertAdjacentHTML('afterbegin', NoteHtml(Notes[0], 1));
  textarea.value = '';
  HandleNewNote();
  SetLocal(NOTES_KEY, Notes);
}