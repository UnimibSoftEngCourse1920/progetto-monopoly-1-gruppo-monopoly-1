note sul codice:
File: server.js, funzione:handlePlayer()
Abbiamo applicato il Design Pattern Strategy nella gestione delle proprieta, ovvero la gestione delle caselle di tipo Property.
Infatti usiamo le classi HSHandler, StationHandler e ServicesHandler (che si occupano rispettivamente della gestione delle caselle di tipo HouseProperty, Station e Services), estendono
tutte e tre la classe generica PlayerHandler, e contengono tutte e tre il codice specifico per gestire la specifica casella attraverso il metodo "handle()".

Utilizziamo implicitamente il Design Pattern Observer per la gestione della comunicazione client-server tramite socket. Infatti:
i client aprono una connessione socket con il server attraverso la funzione "io()" invocata all'inizio della sezione JavaScript degli HTML dei client. Il server ricevera la richiesta di
connessione socket attraverso la funzione "io.sockets.on('connection', function() {...})". A questo punto si è aperto un canale di comunicazione continuo tra server e client, che
possono scambiarsi messaggi attraverso varie funzioni socket.on('identificatore', function(){...}) e socket.emit('identificatore', dati). La socket.emit manda un messaggio a chi sta
in ascolto, che a sua volta riceve il messaggio attraverso una socket.on e invoca la funzione corrispondente. Questo meccanismo sfrutta implicitamente Observer perche è come se colui 
che ha una socket.on resti sempre in attesa di una notifica di cambiamento di stato da parte di colui che invochera la socket.emit, e appena riceve la notifica invoca la funzione che
la gestirà.

Utilizziamo il pattern architetturale Model-View-controller per gestire l'interazione client-server. Controller contiene il file "server.js", model è contenuto nella cartella "server",
view è contenuto nella classe "client".   