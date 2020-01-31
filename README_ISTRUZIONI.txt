Monopoly

Partecipanti al progetto: 
Nathan James Whiting-Jury 830108
Matteo Santannera 830074
Davide Riccardo Moro 831110
Nome gruppo: progetto-monopoly-1-gruppo-monopoly-1 

Il progetto è stato sviluppato interamente in JavaScript e HTML.

Per fare questo progetto avevamo di fronte a noi due opzioni:
- sviluppare il progetto in modo tale che il gioco potesse essere giocato solo in locale, ovvero con un'unica chiamata REST di tipo GET al server per recuperare la pagina HTML e JavaScript, per poi svolgere tutto il gioco e i controlli solo in locale. Dunque una volta effettuata la GET non si avrebbe più alcun contatto con il server (Opzione più semplice).
-sviluppare il progetto in modo tale che il gioco potesse essere giocato online tra giocatori su computer diversi (Opzione più complessa).

Abbiamo deciso dunque di implementare la seconda opzione. Infatti se si dovesse caricare il progetto su un Domain e cambiare tutti i link usati nei vari file HTML per collegarsi al server e recuperare vari file come ad esempio alcune immagini, una volta che il server verrà eseguito su questo Domain, se si è in possesso del link si può giocare online a tutti gli effetti da computer diversi!
Chiaramente noi non lo abbiamo caricato su un domain, dunque per testare il progetto dovrà seguire le istruzioni sotto per configurare il server, e poi aprire almeno 6 schede su chrome usando il link sottostante. Ogni scheda è un giocatore separato, dunque per testare le funzionalità del gioco dovrà passare da scheda a scheda in base a chi tocca.

Appena apre il link si troverà di fronte a due opzioni di gioco: Classic Monopoly e New Monopoly. Classic Monopoly è il Monopoly con le regole classiche di cui siamo ormai consapevoli tutti. New Monopoly contiene tre versioni del gioco diverse: easy, medium e hard che implementano rispettivamente la prima, prima/seconda, prima/seconda/terza configurazioni aggiuntive come da richiesta nel file pdf mandatoci del progetto.
Se vuole testare la Classic basta aprire 6 schede diverse al link sottostante e cliccare su Classic, così come se vuole testare le altre 3 modalità di gioco.
Una volta che una partita è iniziata deve cercare tra le 6 schede che ha aperto il giocatore che deve iniziare la partita, si distingue dalla comparsa del tasto "Roll dice". 
A questo punto potrà simulare l'andamento di un normale gioco online basato sui turni, passando da una scheda all'altra in ordine di turno per simulare il turno del giocatore.
Una partita inizia solo quando 6 giocatori si sono connessi.
Il server gestisce le partite attraverso il meccanismo delle "lobby". Ovvero è in grado di gestire molte partite contemporaneamente! Ovviamente questo andrà ad occupare più memoria, dunque ogni tanto sarebbe bene riavviare il server.
La versione easy di monopoly ha la particolarità che ogni 24 turni vengono cambiati in modo completamente casuale i valori di tutte le proprietà, caselle e carte.
La versione medium contiene le stesse caratteristiche della Easy, con in più la funzionalità delle cosiddette "coins". Ovvero:
Ogni volta che un giocatore capita su una casella e deve pagare un altro giocatore, riceverà in compenso una piccola quantità cash-back in una moneta virtuale che abbiamo chiamato "coin".
Il giocatore potrà usare questi coins in futuro per comprare le case sui propri territori, ovvero potrà usare i coins in alternativa ai soldi normali.
La versione Hard implementa le stesse caratteristiche delle versioni easy e medium ma in più ha la caratteristica che un giocatore può entrare in una partita di altre persone anche se questa partita è già iniziata. Ovvero se in una lobby un player decide di disconnettersi, o perché costretto perché è in debito senza possibilità di pagare, oppure per pura volontà, un altro player che decide di fare una partita hard potrà entrare in questa lobby anche se la partita non è ancora finita. Questo rende il gioco chiaramente più difficile per questo player, poiché nel frattempo gli altri player si saranno impossessati di tante proprietà, mentre lui che è appena entrato non ne ha nessuna.
Per testare il funzionamento della hard visto che magari la spiegazione non è chiarissima basta: 
-iniziare una partita Hard, aprendo dunque 6 schede al link sottostante e cliccando su
"New Monopoly" e poi “Hard” per tutte e sei le schede 
-chiudere poi una di queste schede, oppure schiacciare il tasto "quit", vedrà che sono rimasti solo 5 giocatori in partita
-aprire un'altra scheda e cliccare sempre su New Monopoly e poi hard, vedrà che costui è entrato nella partita di questi 5 giocatori. 
L'andamento del gioco è molto semplice da capire, alla fine è il classico gioco di Monopoly che conosciamo tutti ma fatto online tra giocatori diversi. Potrà sperimentare le diverse funzionalità come il tiro dei dadi, lo scambio tra giocatori, la compra-vendita di case eccetera. 
Il server che ci ha permesso di sviluppare il gioco in questo modo è node.js e va installato per poter giocare (come specificato sotto). Se ha problemi a far funzionare l'applicazione non esiti a contattarci, che comprendiamo il fatto che abbiamo voluto fare una cosa molto diversa probabilmente dal solito.     

Per fare i diagrammi richiesti abbiamo utilizzato IBM Rational Software Architect Designer, dunque deve averlo installato per visualizzare i diagrammi, che sono contenuti nella cartella
"UMLDiagrams_IBMRational". Abbiamo avuto problemi con IBM, nel senso che quando cercavamo di fare il modello di progetto ci andava a modificare anche quello di dominio per qualche motivo, dunque abbiamo tenuto solo quello di progetto.
Abbiamo usato SonarCloud per l'analisi del codice.
Istruzioni d'uso:
Per usare Monopoly l'utente ha bisogno innanzitutto di avere il browser "Google Chrome". Inoltre:
-dovrà installare Node.js dal link https://nodejs.org/en/ seguendo i passi uno per uno (è molto semplice)
-aprire una command-line prompt nella cartella del progetto
-scrivere: 
node server.js
-schiacciare invio
A questo punto dovrebbe partire l'esecuzione del server di node, che dovrebbe eseguire in background in modo innoquo.
Ora potrà provare ad usare la nostra applicazione:
-dovrà aprire il browser di Chrome
-andare sul link: 
http://localhost:1337/ 
A questo punto potrà giocare (ricordandosi del fatto che è un gioco online dunque dovrà aprire più schede per testarlo il gioco).   

Organizzazione codice:
Nella cartella principale del progetto troverà: 
-il file server.js che è il server e va lanciato per poter iniziare a giocare.
-la cartella git
-la cartella node_modules che contiene tutti i file importati che servono a far funzionare il gioco
-la cartella server che contiene tutte le classi che servono al server
-la cartella UMLDiagrams_IBMRational dove sono contenuti i nostri diagrammi
-I due README
-Il file che serve a SonarCloud per la sua analisi
-la cartella client che contiene tutto ciò che userà il client, ovvero:
	-una cartella con dentro dei file .png 
	-la cartella contenente il codice JavaScript che serve al client
-tutti i file HTML e CSS dei client, ovvero Game.html che è l'HTML per il "Classic Monopoly", EasyMonopoly.html, MediumMonopoly.html, HardMonopoly.html e Menu.html che è il menu iniziale principale.
