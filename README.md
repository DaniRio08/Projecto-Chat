# Proyecto Chat

## Objetivo
El objetivo de este trabajo es realizar una aplicación sencilla que combine todo lo aprendido durante el curso, usando java para el BackEnd, MariaDB para la base de datos y HTML, CSS y JavaScript para el FrontEnd. En este caso, la idea es centrarse más en lo aprendido, en el uso de JavaScript para realizar un chat en el que poder mantener diferentes conversaciones con distintas personas. Al seleccionar una conversación con un amigo solo se mostrará su conversación, pero no se perderán los datos del resto de conversaciones que estuviesen activas.

## Distribución de las carpetas
- **FrontChat** --> Contiene los archivos html, css y JavasScript en la sub carpeta "FrontEnd" y además contiene los scripts para crear e insertar los datos (simplemente con la intención de hacer pruebas) en la base de datos en la subcarpeta "ScriptsDB".
- **ProjecteXat** --> Contiene todo lo relacionado con el BackEnd (clases utilizadas y servlets con los cuales se comunica el JavaScript). Aunque tiene alguna modificación, el backend se proporcionó como parte del enunciado del proyecto, ya que como he comentado antes, la intención es trabajar más sobre el JavaScript.

___

## Estructura de la base de datos

#### Tabla: países
- code: varchar(2) (clave primaria)
- name: varchar(100) NOT NULL

#### Tabla: persona
- user: varchar(50) NOT NULL
- mail: varchar(50) NOT NULL (clave primaria)
- pass: varchar(50) NOT NULL
- last_log: date DEFAULT NULL
- session: varchar(9) DEFAULT NULL
- country: varchar(4) NOT NULL

#### Tabla: amistad
- mail1: varchar(50) NOT NULL (clave primaria)
- mail2: varchar(50) NOT NULL (clave primaria)

*Haciendo que la combinación de ambas columnas sea una clave primaria se evita que se pueda tener varias veces el mismo amigo, lo que podría generar problemas*

#### Tabla: mensaje
- id: bigint(20) AUTO_INCREMENT (clave primaria)
- origen: varchar(20) NOT NULL
- desti: varchar(20) NOT NULL
- text: varchar(100) NOT NULL

___

## Estructura del BackEnd

#### Clase ConnectionDB
Representa una conexión a la base de datos y proporciona métodos para realizar operaciones como queries, inserciones y eliminaciones de filas.

- Atributos:
    - private Connection conn: objeto de tipo Connection que representa la conexión a la base de datos.
    - private Statement st: objeto de tipo Statement utilizado para ejecutar consultas SQL en la base de datos.

- Constructores:
    - public ConnectionDB(): constructor que inicializa los atributos conn y st con el valor null.

- Métodos:
    - public boolean conectar(): método que establece la conexión con el servidor de la base de datos MySQL/MariaDB. Retorna un booleano que indica si la conexión se realizó con éxito.
    - public boolean insertUser(User user): método que inserta un nuevo usuario en la base de datos. Recibe como parámetro un objeto User y retorna un booleano que indica si la operación fue exitosa.
    - public void searchUserByMail(User u): método que busca un usuario en la base de datos por su correo electrónico. Recibe como parámetro un objeto User y actualiza sus atributos con la información obtenida de la base de datos.
    - public void searchUserByPass(User u): método que busca un usuario en la base de datos por su correo electrónico y contraseña. Recibe como parámetro un objeto User y actualiza su atributo "user" con el nombre de usuario obtenido de la base de datos.
    - public boolean searchUserBySession(User u): método que busca un usuario en la base de datos por su correo electrónico y código de sesión. Recibe como parámetro un objeto User y retorna un booleano que indica si se encontró al usuario y si su última fecha de inicio de sesión coincide con la fecha actual.
    - public boolean insertFriend(User u, User friend): método que inserta una nueva amistad entre dos usuarios en la base de datos. Recibe como parámetros dos objetos User y retorna un booleano que indica si la operación fue exitosa.
    - public String getCountryList(): método que obtiene la lista de países desde la base de datos y la retorna en formato de cadena JSON.
    - public String getFriends(User u): método que obtiene la lista de amigos de un usuario desde la base de datos y la retorna en formato de cadena JSON.
    - public void updateUser(String query): método que actualiza un usuario en la base de datos mediante una consulta SQL pasada como parámetro.
    - public void nextMissatge(Missatge sms): método que obtiene el próximo mensaje pendiente de recibir por parte de un usuario desde la base de datos. Recibe como parámetro un objeto Missatge y actualiza sus atributos con la información obtenida.
    - public void saveMessage(Missatge sms): método que guarda un mensaje en la base de datos. Recibe como parámetro un objeto Missatge y realiza la inserción en la tabla correspondiente.
    - public void close(): método que cierra la conexión con la base de datos y los objetos Statement y Connection asociados.

- Getters y Setters apropiados

#### Clase User

- Atributos:
    - private String user: nombre de usuario.
    - private String mail: correo electrónico.
    - private String pass: contraseña.
    - private String codeCountry: código del país.
    - private String session: código de sesión.
    - private LocalDate lastLog: última fecha de inicio de sesión.

- Constructores:
    - public User(): constructor vacío que no recibe parámetros.
    - public User(String user, String mail, String pass, String codeCountry): constructor que recibe los valores para los atributos user, mail, pass y codeCountry y los asigna a los respectivos atributos de la clase.

- Métodos:
    - public boolean register(): método que realiza el registro de un usuario en la base de datos. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos, llama al método insertUser de la clase ConnectionDB y luego cierra la conexión. Retorna un booleano que indica si la operación fue exitosa.
    - public void load(String mail): método que carga los datos de un usuario desde la base de datos. Recibe como parámetro el correo electrónico del usuario, actualiza el atributo mail y realiza la búsqueda en la base de datos a través de la instancia de la clase ConnectionDB.
    - public boolean login(): método que realiza el inicio de sesión de un usuario. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos, usa el método searchUserByPass() de la clase ConnectionDB, verifica si se encontró al usuario y actualiza los atributos lastLog y session. Finalmente, actualiza los datos del usuario en la base de datos y cierra la conexión. Retorna un booleano que indica si el inicio de sesión fue exitoso.
    - public boolean isLogged(): método que verifica si un usuario está actualmente conectado. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y usa el método searchUserBySession de la clase ConnectionDB. Retorna un booleano que indica si el usuario está conectado.
    - public boolean setFriend(User friend): método que establece una relación de amistad entre dos usuarios. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y llama al método insertFriend() de la lcase ConenctionDB. Retorna un booleano que indica si la operación fue exitosa.
    - public String getFriends(): método que obtiene la lista de amigos de un usuario en formato de cadena JSON. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y con la instancia creada llama al método getFriends(). Retorna la lista en formato de cadena JSON.

- Getters y Setters: se incluyen los métodos getter y setter para los atributos privados de la clase.

#### Clase Missatge

- Atributos:
    - private int id: identificador del mensaje.
    - private String emisor: nombre del emisor del mensaje.
    - private String receptor: nombre del receptor del mensaje.
    - private String text: contenido del mensaje.

- Métodos:
    - public String toString(): método que devuelve una representación en formato de cadena del objeto Missatge, mostrando sus atributos.
    - public void getMissatge(): método que obtiene un mensaje. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y busca el próximo mensaje a través del método nextMissatge(). Luego, cierra la conexión.
    - public void guardar(): método que guarda un mensaje en la base de datos. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y guarda el mensaje utilizando el método saveMessage(). Finalmente, cierra la conexión.

- Getters y Setters: se incluyen los métodos getter y setter para los atributos privados de la clase.

#### Clase Country

- Atributos:
    - private String code: código del país.
    - private String name: nombre del país.

- Constructores:
    - public Country(): constructor vacío de la clase Country.
    - public Country(String code, String name): constructor que recibe el código y el nombre del país y los asigna a los atributos correspondientes.

- Métodos:
    - public static String returnLista(): método estático que retorna una lista de países en formato JSON. Crea una instancia de la clase ConnectionDB, establece la conexión con la base de datos y utiliza el método getCountryList() para obtener la lista de países. Luego, cierra la conexión y devuelve la lista en formato JSON.

- Getters y Setters apropiados

#### Servlet Login
Este servlet se utiliza para procesar una solicitud GET que realiza un inicio de sesión. Está anotado con @WebServlet("/Login") para mapear la URL "/Login" a este servlet.

Método Get:
- protected void doGet(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud GET. Obtiene los parámetros de la solicitud "mail" y "pass", crea una instancia de la clase User y establece los valores de "mail" y "pass" en el objeto User. Luego llama al método login() en el objeto User para verificar las credenciales. Si el inicio de sesión es exitoso, envía una respuesta al cliente con la sesión y el nombre de usuario separados por ";" usando el método response.getWriter().append(). Si el inicio de sesión no es exitoso, envía una respuesta con el valor "false".

#### Servlet Register
Este servlet se utiliza para procesar una solicitud POST que registra un nuevo usuario. También maneja una solicitud GET para devolver la lista de países necesaria para el registro. Está anotado con @WebServlet("/Register") para mapear la URL "/Register" a este servlet.

Método POST:
- protected void doPost(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud POST. Obtiene los parámetros de la solicitud "user", "mail", "pass" y "pais", crea una instancia de la clase User con esos parámetros y llama al método register() en el objeto User para realizar el registro. Luego envía una respuesta al cliente con el resultado del registro usando el método response.getWriter().append().

Método GET:
- protected void doGet(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud GET. Devuelve la lista de países necesaria para el registro llamando al método estático returnLista() en la clase Country. Luego envía la lista de países como una respuesta al cliente usando el método response.getWriter().append().

#### Servlet Friend
Este servlet maneja solicitudes POST y GET relacionadas con la gestión de amigos. Está anotado con @WebServlet("/Friend") para mapear la URL "/Friend" a este servlet.

Método POST:
- protected void doPost(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud POST. Obtiene los parámetros de la solicitud "mail", "session" y "friend", crea una instancia de la clase User y configura los atributos "mail" y "session" en el objeto User. A continuación, verifica si el usuario está registrado llamando al método isLogged() en el objeto User. Si el usuario está registrado, crea un objeto User para el amigo y carga sus datos llamando al método load() en el objeto User. Si el amigo se encuentra, llama al método setFriend() en el objeto User para agregarlo como amigo. Dependiendo del resultado, se establece una respuesta en forma de cadena ("resposta"). Finalmente, envía la respuesta al cliente usando el método response.getWriter().append().

Método GET:
- protected void doGet(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud GET. Obtiene los parámetros de la solicitud "mail" y "session" y crea una instancia de la clase User. Configura los atributos "mail" y "session" en el objeto User. Luego verifica si el usuario está registrado llamando al método isLogged() en el objeto User. Si el usuario está registrado, llama al método getFriends() en el objeto User para obtener la lista de amigos. Si no hay amigos, la respuesta se establece como una cadena vacía ("[]"). Finalmente, envía la respuesta al cliente usando el método response.getWriter().append().

#### Servlet Xat
Este servlet maneja solicitudes GET y POST relacionadas con la función de chat. Está anotado con @WebServlet("/Xat") para mapear la URL "/Xat" a este servlet.

Método POST:
- protected void doPost(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud POST. Obtiene los parámetros de la solicitud "mail", "session", "receptor" y "sms". Crea una instancia de la clase User y configura los atributos "mail" y "session" en el objeto User. Luego crea un objeto Missatge, configura los atributos "receptor", "text" y "emisor" en los valores correspondientes y llama al método guardar() en el objeto Missatge para guardar el mensaje.

Método GET:
- protected void doGet(HttpServletRequest request, HttpServletResponse response): método que maneja la solicitud GET. Obtiene los parámetros de la solicitud "mail" y "session" y crea una instancia de la clase User. Configura los atributos "mail" y "session" en el objeto User. A continuación, crea un objeto Missatge y configura el atributo "receptor" en el valor del correo electrónico. Luego, se inicia un bucle do-while en el que se duerme el hilo durante 1 segundo y luego se llama al método getMissatge() en el objeto Missatge para obtener un nuevo mensaje. El bucle continúa hasta que se recibe un mensaje (cuando el texto no es nulo). Luego, crea un objeto JSONObject a partir del objeto Missatge y lo convierte en una cadena JSON. Finalmente, envía la cadena JSON como respuesta al cliente usando el método response.getWriter().append().

___

## Estructura del FrontEnd

#### Página: Login
**HTML:**

- Dos inputs, uno para el correo electrónico y otro para la contraseña.
- Botón para enviarLogin().
- Link que permite ir a la página de registro para crear una cuenta.

**CSS:**

Estilo adecuado.

**JS:**

Función enviarLogin():
> Servicio para verificar si un usuario está registrado en la base de datos y recibir un código de sesión para identificar sus conexiones con el backend. Se envía un mensaje GET de HTTP con los siguientes parámetros:
-mail: es el identificador único del usuario
-pass: contraseña ingresada por el usuario.
La respuesta será "false" si no se encuentra coincidencia en la base de datos y en caso contrario, la respuesta será un código de sesión de 9 dígitos.

![Imagen Login](/FrontCaht/FrontEnd/Imagenes/captura_login.jpg)

#### Página: Registro
**HTML:**

- Input del nombre de usuario.
- Input del correo electrónico.
- Select que carga todos los países como opciones,
- Input de la contraseña.
- Input para volver a escribir la contraseña y así confirmarla
- Botón para enviarRegistro().
- Link que permite ir a la página de login para iniciar sesión.

**CSS:**

Estilo adecuado.

**JS:**

Función getPaises():
> Lista de Países
Servicio que recibe un string en formato JSON de objetos Country con los siguientes atributos:
-String code: código internacional de los países, 2 caracteres. (Será el valor del select)
-String name: nombre internacional de los países. (Será el nombre que aparezca en el select)
Para utilizar el servicio, se debe enviar un mensaje GET de HTTP sin parámetros.

Función enviarRegistre():
> Se encarga de registrar y dar de alta a un nuevo usuario en la base de datos. Envía un mensaje POST de HTTP con los siguientes parámetros para poder realizar correctamente el insert:
-user: nombre de usuario
-pass: contraseña del usuario
-mail: correo electrónico del usuario
-codeCountry: código del país de nacionalidad. (value del select)
Solo se enviarán los datos si todos los inputs tienen algún valor y la contraseña y "repetir contraseña" tienen el mismo valor.


Función comprobarContraseña():
> Función que sirve para comprobar si la repetición de la contraseña coincide con el valor de la contraseña.
Se comprueba con cada input en el campo de "rpass" y se va actualizando el borde y una imagen de fondo.

![Imagen Registro](/FrontChat/FrontEnd/Imagenes/captura_registro.jpg)

#### Página: Chat
**HTML:**

- Cabecera que contiene:
    - Input + botón para añadir un amigo nuevo.
    - Nombre de usuario de la persona logeada.
    - Select con los mails de los amigos del usuario + botón para comenzar una nueva conversación.
    - Botón para cerrar la sesión.
- div con display flex donde se van poniendo las diferentes conversaciones activas del usuario de forma horizontal.
- div ".chat" donde se muestran los mensajes y se encuentra el input para escribir y enviar los mensajes.

**CSS:**

Estilo adecuado.

**JS:**

Función añadirAmigo():
> Servicio mediante el cual el usuario agrega un amigo a su lista de amigos. Envía un mensaje POST de HTTP con los siguientes parámetros:
-mail: correo del usuario activo.
-session: código de sesión.
-friend: correo del usuario que se desea agregar a la lista de amigos. (coge el valor de un input al momento de hacer clic en el botón que ejecuta la función)
La respuesta será un código del 0 al 4, donde:
-0: El servidor no responde
-1: Amigo agregado correctamente
-2: Amigo no encontrado
-3: El código de sesión ha expirado y se requiere iniciar sesión nuevamente.
-4: El amigo que se intenta añadir ya es amigo.

Función getAmigos():
> Ejecutada por el evento onload 
Servicio mediante el cual el usuario recibe su lista de amigos de la base de datos y se carga en el select. Envía un mensaje GET de HTTP con los siguientes parámetros:
-mail: correo del usuario activo.
-session: código de sesión.
La respuesta es un array de strings en formato JSON, donde cada elemento es el correo de uno de los amigos.


Función enviarMensaje():
> Se ejecuta cuando se pulsa el botón de enviar o cuando se presiona intro sobre el input donde se escribe el mensaje.
Este servicio permite enviar un mensaje al backend, donde queda almacenado en la tabla "message" de la base de datos hasta que el receptor lo reclame con el servicio de recibirMensaje(). Envía un mensaje POST de HTTP con los siguientes parámetros:
-mail: correo del usuario activo.
-session: código de sesión.
-receptor: el correo para quien está destinado el mensaje.
-sms: texto que se desea enviar.
No se recibe ninguna respuesta por parte del backend, pero la propia función añade un nuevo div ".mensajeSaliente" al div donde se muestan los mensajes.

Función recibirMensaje():
> Se ejecuta con el elemnto onload y se llama a si misma para que siempre se esté ejecutando y esperando mensajes.
Este servicio permite solicitar un mensaje pendiente de recibir por parte del usuario. Envía un mensaje GET de HTTP con los siguientes parámetros:
-mail: correo del usuario activo.
-session: código de sesión.
La respuesta es un único objeto mensaje, que corresponde al mensaje más antiguo pendiente de recibir, en formato JSON.
Mensaje:
-Atributos:
-emisor: correo del remitente del mensaje.
-texto: contenido del mensaje.
El mensaje se muestra en el div ".mensaje" de la conversación actual, es decir, el que tiene por id el correo del emisor.

Función Logout():
> Elimina los elementos guardados en el sessionStorage y vuelve a la página de login.html

Funciones cambiarImagen():
> Las uso tanto para la imagen del logout como la imagen que sirve como botón para enviar el mensaje. Su único proposito es que la imagen cambie cuando se pasa el ratón por encima.

Función nuevaConversación():
> Se ejecuta cuando se presiona el botón a la derecha del select para añadir una conversación.
Lo que hace es crear un nuevo elemento, en este caso un div ".conversacion" con el id "conv-"+ correo del amigo que estaba en el select al presionar el botón". También se crea un div ".mensajes" que será donde se muestren los mensajes de esta conversación. También añade un "eventListener" que se activa al hacer click sobre el div ".conversacion" creado y llama a la función seleccionarChat().

Función seleccionarChat():
> Como explicaba antes, esta función se ejecuta cuando se hace click sobre uno de los divs que contienen las diferentes conversaciones.
Básicamente, lo que hace es ocultar todos los divs donde se guardan los mensajes de aquellas conversaciones que no sean la seleccionada. Para ello toma el valor del id de la conversacion seleccionada, recorre todas las conversaciones que hay y hace que su display sea "none" menos para la seleccionada, a la cual se le cambia el color de las letras para saber que es la que está activa.

![Imagen Chat](/FrontChat/FrontEnd/Imagenes/captura_chat1.jpg)
