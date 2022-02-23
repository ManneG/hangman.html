let gameStarted = false;
let hangman = document.querySelectorAll('.part');
let correctGuesses = 0;
let incorrectGuesses = 0;
let guesses = [];
let wordDiv = document.getElementsByClassName('word')[0];

let hideAll = _=>{
  hangman.forEach((e)=>{
    e.style.visibility = 'hidden';
  })
}

let showAll = _=>{
  hangman.forEach((e)=>{
    e.style.visibility = 'visible';
  })
}

let gameWon = _=>{
  gameStarted = false;
  document.querySelector('.inputBox button').innerHTML = "Start game";
  document.querySelector('.inputBox input').toggleAttribute('readonly');
  document.querySelector('.prompt').innerText = "You won the game!";
}

let resizeWord = _=>{
  if(wordDiv.clientWidth > 302){
      wordDiv.style.transform = 'scale('+ 302/wordDiv.clientWidth +')';
  }
  else{
    wordDiv.style.transform = '';
  }
}

let correctGuess = (guess) => {

  let word = document.querySelector('.inputBox input').value.toUpperCase();
  guess = guess.toUpperCase();
  let i = 0
  while (true){
    i = word.indexOf(guess);
    if (i == -1) break;
    wordDiv.children[i].innerText = guess;
    word = word.replace(guess,'\t');
    correctGuesses++;
  }
  resizeWord();
  if(correctGuesses == word.length){
    gameWon();
  }
}

let incorrectGuess = (guess) => {
  hangman[incorrectGuesses].style.visibility = 'visible';
  document.querySelector('.guesses').innerText += " "+guess.toUpperCase();
  incorrectGuesses++;
  if (incorrectGuesses != hangman.length) return;
  // lost
  revealWord(false);
  gameStarted = false;
  document.querySelector('.inputBox button').innerHTML = "Start game";
  document.querySelector('.inputBox input').toggleAttribute('readonly')
  document.querySelector('.prompt').innerText = "You lost the game! :(";
}

let revealWord = _=> {
  if(!gameStarted) return;
  let word = document.querySelector('.inputBox input').value.toUpperCase();
  for (let i = 0; i < word.length; i++){
    wordDiv.children[i].innerHTML = word[i];
  }
  resizeWord();
}

let validateInput = _=>{
  validChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  for (char of document.querySelector('.inputBox input').value){
    if (!validChars.includes(char.toLowerCase())){
      return false;
    }
  }
  return true;
}


document.addEventListener('keydown',_=>{
  if(!gameStarted) return;
  if(window.event.target == document.querySelector('.inputBox input')) return;
  let guess = window.event.key;
  if(!['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'].includes(guess)) return;
  if(guesses.includes(guess)) return;
  let word = document.querySelector('.inputBox input').value.toLowerCase();
  guesses.push(guess);
  if(word.includes(guess)){ correctGuess(guess); }
  else { incorrectGuess(guess) }
})

document.querySelector('.inputBox button').addEventListener('click',_=>{
  let input = document.querySelector('.inputBox input');
  let button = document.querySelector('.inputBox button');
  if(gameStarted){
    gameStarted = false;
    button.innerHTML = "Start game";
    input.toggleAttribute('readonly')
    showAll();
    document.querySelectorAll('.prompt').forEach((elmnt)=>{elmnt.style.visibility = 'hidden';})
    wordDiv.innerHTML = "";
  }
  else if(input.value != "" && validateInput()){
    gameStarted = true;
    button.innerHTML = "Stop game";
    input.toggleAttribute('readonly')
    hideAll();
    document.querySelector('.prompt').innerText = "Press a key to guess.";
    document.querySelector('.guesses').innerText = "Wrong letters:\n"
    document.querySelectorAll('.prompt').forEach((elmnt)=>{elmnt.style.visibility = 'visible';})
    wordDiv.innerHTML = "";
    guesses = [];
    correctGuesses = 0;
    incorrectGuesses = 0;
    for (let i = 0; i < input.value.length; i++){
      wordDiv.innerHTML += "<p class=\"letter\">_</p>";
    }
    resizeWord();
  }
  else if (!validateInput()){
    alert("Only characters from a-z are allowed.");
  }
  else{
    alert("You need to input a word before starting the game.")
  }
})

//sharing words via link
if (location.search != ''){
  if (location.search.substring(0,3) == "?o="){
    document.querySelector('.inputBox input').value = atob(location.search.substring(3));
    document.querySelector('.inputBox button').dispatchEvent(new Event('click'));
  }
}

//creating link
let linkCopyable = false;
document.querySelector('.createLink').addEventListener('click',_=>{
  if(!validateInput()){
    alert("Only characters from a-z are allowed.");
    return;
  }
  document.querySelector('.linkBox').value = location.origin + location.pathname + "?o=" + btoa(document.querySelector('.inputBox input').value);
  linkCopyable = true;
})

document.querySelector('.copyBtn').addEventListener('click',_=>{
  if (!linkCopyable) return;
  let linkBox = document.querySelector('.linkBox');
  linkBox.focus();
  linkBox.select();
  document.execCommand('copy');
  linkBox.value = "Copied!";
  linkCopyable = false;
})
