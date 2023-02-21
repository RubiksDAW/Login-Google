import { login, logout } from './auth.js';
import { insert, updateTarea } from './firestore.js';
import { getTareas } from './firestore.js';
import { getUUID } from './utils.js';

const buttonLogin = document.getElementById('login');
const buttonLogout = document.getElementById('button-logout');
const todoform = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const userInfo = document.getElementById('user-info');
const todoContainer = document.getElementById('todos-container');

let usuarioActual;
let tareas = [];

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    usuarioActual = user;
    console.log(`Usuario logueado: ${usuarioActual.displayName}`);
    init();
  } else {
    console.log('No hay usuario logueado');
  }
});

buttonLogin.addEventListener('click', async (e) => {
  try {
    usuarioActual = await login();
    console.log(usuarioActual);
  } catch (error) {
    console.log(error);
  }
});

buttonLogout.addEventListener('click', (e) => {
  logout();
  buttonLogin.classList.remove('hidden');
  todoform.classList.add('hidden');
});

todoform.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value;
  if (text !== '') {
    addTarea(text);
    todoInput.value = '';
    loadTareas();
  }
  console.log(text);
});

function init() {
  buttonLogin.classList.add('hidden');
  buttonLogout.classList.remove('hidden');
  todoform.classList.remove('hidden');
  userInfo.innerHTML = `<img src="${usuarioActual.photoURL}" width=32px />
    <span>${usuarioActual.displayName}</span>
    `;
  loadTareas();
}

async function addTarea(text) {
  try {
    const todo = {
      id: getUUID(),
      text: text,
      completed: false,
      userid: usuarioActual.uid,
    };

    const response = await insert(todo);
    loadTareas();
  } catch (error) {
    console.log(error);
  }
}

export async function loadTareas() {
  todoContainer.innerHTML = '';
  tareas = [];
  try {
    const response = await getTareas(usuarioActual.uid);
    tareas = [...response];
    renderTareas();
  } catch (error) {
    console.log(error);
  }
}

export function renderTareas() {
  let html = '';

  tareas.forEach((tarea) => {
    html += `
        <li class="todo">
            <input type = "checkbox" id="${tarea.id}" ${
      tarea.completed ? 'checked' : ''
    } />
            <span>${tarea.text}</span>
        </li>
        `;
  });

  todoContainer.innerHTML = html;

  document
    .querySelectorAll('#todos-container input[type=checkbox]')
    .forEach((check) => {
      check.addEventListener('change', async (e) => {
        const id = check.id;
        const tarea = tareas.find((tarea) => tarea.id == id);
        console.log(tarea);
        tarea.completed = check.checked;
        try {
          await updateTarea(id, tarea);
        } catch (error) {
          console.log(error);
        }
      });
    });
}

export function resetUI() {
  todoContainer.innerHTML = '';
}
