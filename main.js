//console.log("hello")

const loggedInLinks = document.querySelectorAll(".logged-in");   // obtiene todos los elementos li con la clase logged-in
const loggedOutLinks = document.querySelectorAll(".logged-out"); // obtiene todos los elementos li con la clase logged-out

const loginCheck = (user) => { // Funcion para ocultar y mostrar etiquetas cuando el usuario esta autenticado o no
    if (user){ // si esta logueado, muestro logout y nada mas
        loggedInLinks.forEach((link) => (link.style.display ="Block")); // muestro los elementos con la clase logged-in
        loggedOutLinks.forEach((link) => (link.style.display="none")); // oculto los elementos con la clase logged-out
    }else{ // si el usuario no esta logueado, muestro los elementos para loguearse
        loggedInLinks.forEach((link) => (link.style.display = "none")); // oculto los elementos con la clase logged-in
        loggedOutLinks.forEach((link) => (link.style.display = "block")); // muestro los elementos con la clase logged-out
    }
};

// ----- LogOut button -----
const logOut = document.querySelector("#logout");

logOut.addEventListener("click", (e) =>{
    console.log("enviando logOut");
    e.preventDefault();

// Log Out de usuario autenticado
    auth
        .signOut()
        .then( () =>{
            console.log("SignOut");
    });
});

// ----- Sign up button ----- 
const signUpForm = document.querySelector("#signup-form"); // Ubico el elemento formulario con el id signup-form

signUpForm.addEventListener("submit", (e) =>{ //Variable e para capturar los eventos del formulario
    //console.log("enviando signup");
    e.preventDefault();  // cancela el evento por defecto y continua las instruciones
    const email = document.querySelector("#signup-email").value;         // Obtengo valores del formulario
    const password = document.querySelector("#signup-password").value;   // Obtengo la contraseña
    //console.log(email,password);

// Autenticar Sign up
    auth
        .createUserWithEmailAndPassword(email,password)
        .then(userCredential => {
            signUpForm.reset(); // Reiniciar el formulario o limpiar
                console.log("Sign up"); // !Registro!
            $("#signupModal").modal("hide"); // Oculto modal. (Sintaxis Jquery)
        });
});

// ----- Sign in button -----
const signInForm = document.querySelector("#login-form");

signInForm.addEventListener("submit", (e) =>{
    //console.log("enviando signin");   
    e.preventDefault();
    const email = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;
    console.log(email,password);

// Autenticar Sign in
    auth
        .signInWithEmailAndPassword(email,password)
        .then(userCredential =>{
            signInForm.reset();
                console.log("SignIn"); // !Logueo!
            $("#signinModal").modal("hide");
        });
});

// ----- Sign in Google Button -----
const signInGoogle = document.querySelector("#googleLogin");

signInGoogle.addEventListener ("click", (e)  => {
    e.preventDefault();
    signInForm.reset();
    $("#signinModal").modal("hide");

// Autenticacion con google
    const provider = new firebase.auth.GoogleAuthProvider(); // Creo instancia del objeto del proveedor de google
    auth.signInWithPopup(provider).then((result) =>{   // LLamo al metodo y envio el objeto providor (auth de google)
        console.log(result);
        console.log("google sign in");    
    })
    .catch(err =>{
        console.log(err);
    })
});

// ----- Sign in Facebook Button -----
const signInFacebook = document.querySelector("#facebooklogin");

signInFacebook.addEventListener ("click", (e)  => {
    e.preventDefault();
    signInForm.reset();
    $("#signinModal").modal("hide");

// Autenticacion con facebook
    const provider = new firebase.auth.FacebookAuthProvider(); // Creo instancia del objeto del proveedor de google
    auth.signInWithPopup(provider).then((result) =>{   // LLamo al metodo y envio el objeto providor (auth de google)
        console.log(result);
        console.log("facebook sign in");    
    })
    .catch(err =>{
        console.log(err);
    })
});

// ----- POSTS -----
const postList = document.querySelector(".posts"); // Obtengo el objeto o elemento ul con la clase posts
// ----- Consulta a DB FireStore -----
const setupPost = (data) => {   // funcion setupPost, recibe el arreglo de datos
    console.log("entro a funcion setupPost")
    console.log("Valor array:", data.length);
    if (data.length){ // Si tiene datos tengo que recorrerlos
        let html = ""; // variable html para asignar los elementos LI creados en JS
        data.forEach( (doc) => {    // Recorro el array con una variable independiente doc
            const post = doc.data(); // Asigno cada elemento del arreglo mediante funcion para que no lo muestre indefinido 
            console.log(post);
            // Muestro y guardo los elemtos li a mostrar
            const li = `    
            <li class="list-group-item list-group-item-action">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
            </li>            
            `;
            html += li; // Asigno y voy agregando con += a la variable html el valor de la lista
        });
        postList.innerHTML = html; // Asigno al elemento con la clase posts la variable html con los elementos li
    } else{ // Si el arreglo esta vacio es porque el usuario no ha logueado, entonces indico que debe loguearse
        console.log("entro al else")
        postList.innerHTML = '<h4>Login to See Posts</h4>';
    }
};

// Metodo que verifica si el usuario esta logueado al iniciar aplicacion
auth.onAuthStateChanged(user =>{
    loginCheck(user); // llamado a la funcion loginCheck para identificar elementos a mostrar al incio de la aplicacion
    if (user){  // Si esta logueado muestro publicaciones
        console.log("logueado");
        fs.collection("posts").get().then(snapshot =>{ //metodo collection para ver y consultar la coleccion de datos
                console.log(snapshot.docs); // muestra los documentos de la coleccion posts, los trae en forma de arreglo
                setupPost(snapshot.docs); // llamo a la funcion setupPost y le envio el arreglo de datos
            }); 
    } 
    else{
        console.log("no logueado");
        setupPost([]); // Si no esta logueado, envio un arreglo vacio para que no muestre POST
    }
});

// Crea usuario y registra directamente a firebase google
// No hay manejo de errores, se puede manejar con un try catch
// no distingue si el correo existe o no
