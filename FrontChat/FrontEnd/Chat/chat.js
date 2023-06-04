//variables que sirven para determinar la conversación que está seleccionada en este momento
var idConv = "";
var idMensaje = "";
var convSeleccionada = null;

/*Función que se ejecuta cuando se hace click sobre el botón de ".add" y añade un nuevo div de una conversación
al div de ".botonesChat".*/
function nuevaConversacion() {
    // Primero se obtiene el valor del select que está seleccionado en el momento de hacer click sobre el botón ".add"
    let select = document.getElementById("listaAmigos");
    let amigoSeleccionado = select.options[select.selectedIndex].text;

    //Se recogen todos los div ".conversacion" (los que se crean con la función) y se añaden sus id individuales en una lista
    let conversaciones = document.querySelectorAll(".conversacion");
    let listConv = [];
    for (var i = 0; i < conversaciones.length; i++) {
        let id = conversaciones[i].id;
        listConv.push(id);
    }

    //Si el valor del select no es el por defecto ni un amigo con el que ya se tiene una conversación se ejecuta el código
    if (amigoSeleccionado !== "AMIGO" && !listConv.includes("conv-" + amigoSeleccionado)) {
        document.getElementById("respuestaB").innerHTML = "<p style='color:green; margin: 0'>Nueva conversación</p>"

        //Se crea el elemento div con la clase ".conversación" y con id "conv-(email del select)"
        let divConversacion = document.createElement("div");
        divConversacion.id = "conv-" + amigoSeleccionado;
        divConversacion.classList.add("conversacion");
        divConversacion.textContent = amigoSeleccionado;

        /*Para poder tener varias conversaciones y que solo se muestre la que está seleccionada, 
        he añadido una función que se ejecuta al hacer click sobre el div ".conversacion" */  
        divConversacion.addEventListener("click", function () {
            idConv = this.id;
            idMensaje = idConv.replace("conv", "mens");
            
            seleccionarChat();
        });
    

        //Se añade el div creado al div de botonesChat
        let botonesChat = document.getElementsByClassName("botonesChat")[0];
        botonesChat.appendChild(divConversacion);

        // Y lo mismo para el div de los mensajes (donde se muestra lo que se escribe)
        let divMensajes = document.createElement("div");
        divMensajes.id = "mens-" + amigoSeleccionado;
        divMensajes.classList.add("mensajes");
        divMensajes.style.display = "none";

        // Añadir el nuevo div de mensajes al div chat
        let divChat = document.getElementsByClassName("chat")[0];
        divChat.appendChild(divMensajes);

    } else if (amigoSeleccionado === "AMIGO") {
        document.getElementById("respuestaB").innerHTML = "<p style='color:red; margin: 0'>Selecciona un amigo</p>";
    } else {
        document.getElementById("respuestaB").innerHTML = "<p style='color:red; margin: 0'>Ya tienes una conversación con ese amigo</p>"
    }
}

//Función que oculta todos los divs donde se guardan los mensajes de aquellas conversaciones que no sean la seleccionada
function seleccionarChat() {
    
    //Se crean las variables mensaje y conversación que toman como valor los id del div ".conversacion"
    let mensaje = document.getElementById(idMensaje);
    let conversación = document.getElementById(idConv);


    //Cuando se deja de seleccionar uno de los div ".conversacion" vuelve a su color por defecto
    if (convSeleccionada) {
        convSeleccionada.style.color = "";
        convSeleccionada.style.backgroundColor = "";
    }
    
    //Cambia el color del texto contacto seleccionado
    conversación.style.color = "blueviolet";

    //Oculta todos los divs de conversación
    let listaMensajes = document.querySelectorAll(".mensajes");
    for (let mens of listaMensajes) {
        mens.style.display = "none";
    }

    //Menos el div seleccionado
    mensaje.style.display = "flex";

    // Cambiar el orden del div de mensajes al principio (si no se muestra el input para escribir arriba)
    let divChat = document.getElementsByClassName("chat")[0];
    divChat.insertBefore(mensaje, divChat.firstChild)

    convSeleccionada = conversación;
}

//Función que permite añadir un amigo, se comunica con el backEnd y hace una inserción a la tabla "amistad" de la base de datos
function añadirAmigo() {
    var http = new XMLHttpRequest();

    let mail = window.sessionStorage.getItem("mail");
    let session = window.sessionStorage.getItem("session");
    let friend = document.getElementById("nuevoAmigo").value;

    if (mail != friend) { //Se verifica el email del amigo no sea el propio
        http.open("POST", "http://localhost:3000/ProjecteXat/Friend", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("mail="+mail+"&session="+session+"&friend="+friend);

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let respuesta = http.responseText; //Las posibles respuestas se indican en el backEnd
                if (respuesta == 0) {
                    //Error: el servidor no responde
                } else if (respuesta == 1) {
                    //Amigo añadido
                    document.getElementById("respuestaA").innerHTML = "<p style='color:green; margin: 0'>Amigo añadido con éxito</p>";
                    document.getElementById("nuevoAmigo").value = "";
                    getAmigos();
                } else if (respuesta == 2) {
                    //El amigo no ha sido encontrado
                    document.getElementById("respuestaA").innerHTML = "<p style='color:red; margin: 0'>Usuario no encontrado</p>";
                    document.getElementById("nuevoAmigo").value = "";
                } else if (respuesta == 3) {
                    alert("La sesión ha expirado");
                    document.getElementById("nuevoAmigo").value = "";
                } else if (respuesta == 4) {
                    document.getElementById("respuestaA").innerHTML = "<p style='color:red; margin: 0'>Ya es tu amigo</p>";
                    document.getElementById("nuevoAmigo").value = "";
                }
            }
        }
    } else {
        document.getElementById("respuestaA").innerHTML = "<p style='color:red; margin: 0'>Eres tu mismo, bobo</p>";
    }
}

//Función que carga todos los amigos del usuario actual en un select. Este select será el que se use para añadir nuevas conversaciones
function getAmigos() {
    let http = new XMLHttpRequest();

    let mail = window.sessionStorage.getItem("mail");
    let session = window.sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/ProjecteXat/Friend?mail="+mail+"&session="+session, true);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let select = document.getElementById("listaAmigos");
            select.innerHTML = "";
            select.innerHTML = "<option selected disabled>AMIGO</option>";

            let jsonString = http.responseText;

            let listaAmigos = JSON.parse(jsonString);

            for (let i = 0; i < listaAmigos.length; i++) {
                let select = document.getElementById("listaAmigos");
                let option = document.createElement("option");
                option.text = listaAmigos[i];
                option.value = listaAmigos[i];
                select.add(option);
            }
        }
    }
}

/*Función que se comunica con el backEnd y como se llama a si misma siempre está "escuchando" nuevos mensajes donde el 
destinatario sea el usuario actual*/
function recibirMensaje() {
    let http = new XMLHttpRequest();

    let mail = window.sessionStorage.getItem("mail");
    let session = window.sessionStorage.getItem("session");

    http.open("GET", "http://localhost:3000/ProjecteXat/Xat?mail="+mail+"&session="+session, true);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let jsonString = http.responseText;

            let mensajeRecibido = JSON.parse(jsonString);

            /*Es importante que la conversación en la que se añada el mensaje sea la que tiene el id compuesto por el correo
            del emisor, ya que si se hace con el id de la conversación seleccionada actualmente el mensaje se mostrará 
            en una conversación no deseada, queremos que el mensaje vaya al div de la conversación del emisor*/
            let conversación = document.getElementById("mens-"+mensajeRecibido.emisor).innerHTML;

            let nuevoMensaje = "<div class='mensajeEntrante'><p>" + mensajeRecibido.text + "</p></div>";

            document.getElementById("mens-"+mensajeRecibido.emisor).innerHTML = conversación + nuevoMensaje;

            //Como explicaba al principio la función se llama a sí misma para estar siempre activa
            recibirMensaje();
        }
    }
    
}

/*Función que coge el valor del input para enviar el mensaje y se comunica con el backEnd para que se guarde el mensaje en la base
de datos que después será el que se recibirá*/
function enviarMensaje() {
var http = new XMLHttpRequest();

    let mail = window.sessionStorage.getItem("mail");
    let session = window.sessionStorage.getItem("session");
    let receptor = document.getElementById(idConv).textContent; //El receptor es el correo de la conversación seleccionada
    let sms = document.getElementById("sms").value;

    if (sms != "") { //No permite enviar mensajes sin contenido
        http.open("POST", "http://localhost:3000/ProjecteXat/Xat", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("mail="+mail+"&session="+session+"&receptor="+receptor+"&sms="+sms);

        let conversación = document.getElementById(idMensaje).innerHTML;

        let nuevoMensaje = "<div class='mensajeSaliente'><p>" + sms + "</p></div>";

        document.getElementsByClassName("mensajes")[0].innerHTML = conversación + nuevoMensaje;
        
        document.getElementById("sms").value = "";
    }
}

//Esto hace que el mensaje se pueda enviar con el intro y no solamente pulsando el botón de enviar
function checkEnter(event) {
    if (event.keyCode == 13) {
        enviarMensaje();
    }
}

//Anteriormente había guardado el "user" de la persona que ha hecho login y lo uso para que salga en la cabecera del chat
function getUser() {
    document.getElementById("user").innerHTML = "<h1 id='nombre'>"+window.sessionStorage.getItem("user")+"</h1>";
}

//Función para hacer logout y que por lo tanto borra el contenido del sessionStorage y vuelve a la página de login
function LogOut() {
    window.sessionStorage.removeItem("mail");
    window.sessionStorage.removeItem("session");
    window.sessionStorage.removeItem("user");
    window.location.replace("../Registro/login.html")
}

//Tanto esta como "cambiarImagenEnviar()" sirven para que una imagen cambie cuando se pase el ratón por encima
function cambiarImagenLogout(over) {
    var img = document.getElementById("logout");
    if (over) {
        img.src = "../Imagenes/logoutB.png"; // Ruta de la nueva imagen
    } else {
        img.src = "../Imagenes/logout.png"; // Ruta de la imagen original
    }
}

function cambiarImagenEnviar(over) {
    var img = document.getElementById("botónEnviar");
    if (over) {
        img.src = "../Imagenes/enviarH.png"; // Ruta de la nueva imagen
    } else {
        img.src = "../Imagenes/enviar.png"; // Ruta de la imagen original
    }
}