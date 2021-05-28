const { Client } = require('whatsapp-web.js');
var socketInstace;
const fs = require('fs');


const SESSION_FILE_PATH = 'session.json';
let sessionCfg;
//if (fs.existsSync(SESSION_FILE_PATH)) {
 //   sessionCfg = require(SESSION_FILE_PATH);
//}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });


module.exports = {
    initializeClient(socket){
        console.log('📱 Create Instance starting . . .');
        socketInstace = socket;
        client.initialize();
    }
}
//Events
client.on('qr', qr => {
    socketInstace.emit("QRCODE", qr)
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
  //  sessionCfg=session;
 //   fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
   //     if (err) {
     //       console.error(err);
       // }
    //});
});

client.on('ready', () => {
    console.log('Client is ready!😀');
    socketInstace.emit("Logged", true )
});

var clientes = [];

client.on('message', async msg => {
    console.log('MESSAGE RECEIVED', msg);
    var chat = await msg.getChat(msg.to)
    var user = await chat.getContact(msg.to)
    var foto = await user.getProfilePicUrl(msg.to)

    let cliente = {
        nome:msg.from,
        picture: foto,
        status:'Pedido em Andamento'
    }

    const validaPresente = (clientes, validar) => {
        let result;
        clientes.forEach(cliente => {
            if(cliente.nome === validar.nome){
                result = true;
            }else{
                result = false;
            }            
        });
        return result;
    } 

    const aaaa = validaPresente(clientes, cliente)
    console.log(aaaa)
    if(!validaPresente(clientes, cliente)){
        clientes.push(
            {
                nome:msg.from,
                picture: foto,
                status:'Pedido em Andamento'
            }
        )
        cliente = {}; 
    }

    
    console.log(clientes)
    socketInstace.emit('EM_ATENDIMENTO', clientes)
    const digitaEnvia = new Promise((resolve, reject) => {
        chat.sendStateTyping()
        setTimeout(() => {
            if(!chat.isGroup){
                client.sendMessage(msg.from, 'Olá, Eu sou o Bot do Andrey, como posso ajudar?'); 
                if(msg.body === '!location'){
                    msg.reply(msg.location);
                }  
                if(msg.body === '!ping'){
                    client.sendMessage(msg.from, 'Pong'); 
                }   
              }
        }, 3000);
        resolve()
      });
     
     await digitaEnvia.then(()=>{
      });
});