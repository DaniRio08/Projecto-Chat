/*Función que carga en el select todos los países y sus respectivos códigos de la base de datos.
Se comunica con el servlet "Register" que devuelve un JSON con todos los países*/
function getPaises() {
    let http = new XMLHttpRequest();

    http.open("GET", "http://localhost:3000/ProjecteXat/Register", true);
    http.send();

    http.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            let jsonString = http.responseText;

            let listaPaíses = JSON.parse(jsonString);

            for (let i = 0; i < listaPaíses.length; i++) {
                let select = document.getElementById("pais");
                let option = document.createElement("option");
                option.text = listaPaíses[i].name;
                option.value = listaPaíses[i].code;
                select.add(option);
            }
        }
    }
}

/*Función que capta todos los valores de los input y select del registro y los manda al backend para
después hacer una inserción de una nueva persona en la base de datos*/
function enviarRegistre(event) {
    event.preventDefault(); //evita la recarga de la página
    var http = new XMLHttpRequest();

    let user = document.getElementById("user").value;
    let mail = document.getElementById("mail").value;
    let pais = document.getElementById("pais").value;
    let pass = document.getElementById("pass").value;
    let rpass = document.getElementById("rpass").value;

    if (pass == rpass) { //Solo se puede enviar si el input "contraseña" y "repetir contraseña" coinciden
        http.open("POST", "http://localhost:3000/ProjecteXat/Register", true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.send("user="+user+"&mail="+mail+"&pais="+pais+"&pass="+pass);

        http.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let insercion = http.responseText;
                if (insercion == "true") {
                    window.location.href = "./login.html";
                } else {
                    document.getElementById("respuesta").innerHTML = "<p style='color:red'>Ese usuario ya existe</p>";
                    document.getElementById("formulario").reset(); //Restablece los valores del formulario
                }
            }
        }
    } else {
        document.getElementById("respuesta").innerHTML = "<p style='color:red'>Las contraseñas no coinciden</p>"
    }
}

/*Función que capta los valores de los inputs del login y los manda al servlet "Login" del BackEnd, el cual
comprueba si son correctos en cuyo caso se pasa a la página del chat */
function enviarLogin(event) {
    event.preventDefault(); //evita la recarga de la página
    var http = new XMLHttpRequest();

    let mail = document.getElementById("mail").value;
    let pass = document.getElementById("pass").value;

    http.open("GET", "http://localhost:3000/ProjecteXat/Login?mail="+mail+"&pass="+pass, true);
    http.send();

    http.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            let sessionYUser = this.responseText;
            if (sessionYUser != "false") {
                window.sessionStorage.setItem("mail", mail);
                let items = sessionYUser.split(";");
                window.sessionStorage.setItem("session", items[0]);
                window.sessionStorage.setItem("user", items[1]);
                window.location.href = "../Chat/chat.html";
            } else {
                document.getElementById("respuesta").innerHTML = "<p style='color:red'>Email o contraseña no válidas</p>";
                document.getElementById("formulario").reset();
            }
        }
    }
}

/*Función que sirve para comprobar si la repetición de la contraseña coincide con el valor de la contraseña.
Se comprueba con cada input en el campo de "rpass" y se va actualizando el borde y una imagen de fondo*/
function comprobarContraseña() {
    let contr1 = document.getElementById("pass").value;
    let contr2 = document.getElementById("rpass").value;
    if (contr1 !== contr2) {
        document.getElementById("rpass").style.border = "1px solid red";
        document.getElementById("rpass").style.backgroundImage = "url('../Imagenes/wrong.png')";
        document.getElementById("rpass").style.backgroundRepeat = "no-repeat";
        document.getElementById("rpass").style.backgroundPosition = "20em";
    } else {
        document.getElementById("rpass").style.border = "1px solid green";
        document.getElementById("rpass").style.backgroundImage = "url('../Imagenes/correct.png')";
        document.getElementById("rpass").style.backgroundRepeat = "no-repeat";
        document.getElementById("rpass").style.backgroundPosition = "20em";
    }
}