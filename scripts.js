//Global variables
const chat = document.querySelector('#view ul');
var username;

//Eventlistners
document.querySelector('#username-box button').addEventListener("click", verifyUsername)
document.querySelector('#username-box input').addEventListener("keydown", ()=>{event.key == "Enter" ? verifyUsername() : null})
document.querySelector('#send-box button').addEventListener("click", sendmsg)
document.querySelector('#send-box input').addEventListener("keydown", ()=>{event.key == "Enter" ? sendmsg() : null})

//Clear chat database on usser login
firebase.database().ref("chat").remove();
firebase.database().ref("onlineusers").remove();

//Verify username
function verifyUsername(){ 
    const input = document.querySelector("#username-box input");
    username = input.value;
    if(username.length && username.search( /\s/g ) == -1){
        document.body.removeChild(event.path[1])
        document.querySelector("main").classList.toggle('hide');
        firebase.database().ref("onlineusers").push(username);
    }else{
        document.querySelector('#username-box p').innerHTML = `Nome inválido`
    } 
}

function sendmsg(){
    let msg = document.querySelector('#send-box input').value;
    msg.trim();
    const isEmpty = /^[ ]*$/.test(msg)
    if(msg.length && !isEmpty){
        const key = firebase.database().ref("chat").push().key;
        firebase.database().ref("chat").child(key).set({author: username,msg: msg});
    }

    document.querySelector('#send-box input').value = "";  
}


firebase.database().ref("onlineusers").orderByKey().limitToLast(1).on("child_added", function(snapshot) {
    chat.innerHTML += `<li class="bot"><span><p>@${snapshot.val()}</p><p>ENTROU NO CHAT</p></span></li>`
    scrollChatToBottom();
})

//get last message
firebase.database().ref("chat").orderByKey().limitToLast(1).on("child_added", function(snapshot) {
    
        showMessage(snapshot.val().author,snapshot.val().msg)
        scrollChatToBottom();
})

function showMessage(author,msg){
    const msgBox = document.createElement('li');
    const authorBox = document.createElement('h1');
    const contentBox= document.createElement('p');

    var authorText = document.createTextNode(author+":")
    var contentText = document.createTextNode(msg)
    authorBox.appendChild(authorText);
    contentBox.appendChild(contentText);
    msgBox.appendChild(authorBox);
    msgBox.appendChild(contentBox);
    chat.appendChild(msgBox);
}

function scrollChatToBottom(){
    const ul = document.querySelector('#view')
    ul.scrollTo(0,ul.scrollHeight)
}


// function botMsg(){

//     setInterval(() => {
//         const bots = ["Albert","Allen","Bert","Bob","Cecil","Clarence","Elliot","Elmer","Ernie","Eugene","Fergus","Ferris","Frank","Fred","George","Graham","Harvey","Irwin","Larry","Lester","Marvin","Neil","Niles","Oliver","Opie","Ryan","Toby","Ulric","Ulysses","Uri","Waldo","Wally","Walt","Wesley","Yanni","Yogi","Yuri"]
//         const frases = ["Design não é apenas o que parece e o que se sente. Design é como funciona.","Inovação distingue um líder de um seguidor.","Eu quero colocar uma marca no universo.","Às vezes, a vida bate com um tijolo na sua cabeça. Não perca a fé.","É melhor ser pirata do que entrar na Marinha.","Seja criterioso com a qualidade. Algumas pessoas não estão acostumadas com um ambiente onde a excelência é esperada.","As coisas não precisam mudar o mundo para serem importantes.","Tenho tanto orgulho do que nós não fazemos quanto tenho do que fazemos.","Eu trocaria toda a minha tecnologia por uma tarde com Sócrates.","É raro ver um artista nos seus 30 ou 40 anos capaz de contribuir com algo incrível."]
//         const key = firebase.database().ref("chat").push().key;
//         firebase.database().ref("chat").child(key).set({author: bots[Math.floor(Math.random() * bots.length)],msg: frases[Math.floor(Math.random() * frases.length)]});
//     }, 2000);
    
// }