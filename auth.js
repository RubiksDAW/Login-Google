import { resetUI } from './app.js';
import { loadTareas } from './app.js';
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

auth.lenguageCode = 'es';

export async function login() {
  try {
    const response = await auth.signInWithPopup(provider);
    console.log(response);
    loadTareas();
    return response.user;
  } catch (error) {
    throw new Error(error);
  }
}

export function logout() {
  auth.signOut();
  resetUI();
}
