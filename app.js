import { login,logout } from "./auth.js";

const buttonLogin = document.getElementById("login")
const buttonLogout = document.getElementById("button-logout")
const todoform = document.getElementById("todo-form")
const userInfo = document.getElementById("user-info")
let usuarioActual; 

firebase.auth().onAuthStateChanged((user) =>{
    if(user){
        usuarioActual = user;
        console.log(`Usuario logueado: ${usuarioActual.displayName}`)
        init()
    }else{
        console.log("No hay usuario logueado")
    }
})


buttonLogin.addEventListener("click", async(e)=> {
    try {
        usuarioActual = await login()
        console.log(usuarioActual)
    } catch (error) {
        
    }
})

buttonLogout.addEventListener("click", (e)=> {
    logout()
    buttonLogin.classList.remove("hidden")
    todoform.classList.add("hidden")
})

function init(){
    buttonLogin.classList.add("hidden");
    buttonLogout.classList.remove("hidden");
    todoform.classList.remove("hidden");
    userInfo.innerHTML=`<img src="${usuarioActual.photoURL}" width=32px />
    <span>${usuarioActual.displayName}</span>
    `

}

