let $btnNewGame = $('#btnNewGame');
let $selectLevel = $('#selectLevel');
let $timePassed = $('#timePassed');
let $flippedCount = $('#flippedCount');
let $flippedLettersNum = $('#flippedLettersNum');
let $btnShowModalStatistic = $('#btnShowModalStatistic');
const statistics = new PlayingStatistics();

$(() => {
  $btnNewGame.click(newGame);
  $selectLevel.change(changeLevel);
  $btnShowModalStatistic.click(showModalChartStatistic);
  $(window).on('beforeunload', saveDataToLocalStorage);
  newGame();
  getDataFromLocalStorage();
})

function saveDataToLocalStorage(){
  localStorage.setItem('statistics', JSON.stringify(statistics.resultsList));
}

function getDataFromLocalStorage(){
  let data = localStorage.getItem('statistics');
  console.log(data);
  if(!data) return;
  if(data == '') return;
  statistics.resultsList = JSON.parse(data);
}

let arrLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let $gameArea = $('#gameArea');
let arrFlippedLetters = [];
let arrClickedLetter = [];
let isWinGame = false;
let timePassed = 0;
let timePassedInterval = setInterval(setTimePassed, 1000);
let level = 12;
let arrPlayingGameLetters = [];
let lastIndex = -1;
let flippedCount = 0;


function changeLevel(e){
  let val = e.target.value;
  level = Number(val);
}

function changeFormatTime(seconds){
  if(seconds < 60) return seconds;
  if(seconds < 60*60) return `${Math.floor(seconds/60)} : ${seconds%60}`;
  return `${Math.floor(seconds/3600)} : ${Math.floor((seconds % 3600)/60)} : ${seconds % 3600 % 60}`;
}

function setTimePassed(){
  if(isWinGame) return;
  timePassed++;
  $timePassed.text(changeFormatTime(timePassed));
}

function shuffleArray(temp){
  let arr = temp.slice();
  let length = arr.length;
  for(let i = 0; i < length; i++){
    let randomNum = Math.floor(Math.random() * length);
    let temp = arr[i];
    arr[i] = arr[randomNum];
    arr[randomNum] = temp;
  }
  return arr;
}

function resetGame(){
  arrFlippedLetters.length = 0;
  arrPlayingGameLetters.length = 0;
  arrClickedLetter.length = 0;
  lastIndex = -1;
  isWinGame = false;
  timePassed = 0;
  flippedCount = 0;
  $timePassed.text(0);
  $flippedCount.text(0);
  $flippedLettersNum.text(0);
}

function newGame(){
  resetGame();
  renderGameArea();
}

function randomArrPlayingGameLetters(){
  let temp = shuffleArray(arrLetters);
  let arrTemp = []
  for(let i = 0; i < level; i++){
    arrTemp.push(temp[i]);
  }
  let arrTemp_2 = shuffleArray(arrTemp);
  return arrTemp.concat(arrTemp_2);
}

function renderGameArea(){
  setSizeGameArea();
  arrPlayingGameLetters = randomArrPlayingGameLetters();
  $gameArea.html('');
  arrPlayingGameLetters.forEach((item, index) => {
    let $square = $('<div class="square"></div>');
    $square.click(e => handleClickOnSquare(e, item, index));
    $gameArea.append($square);
  })
}

function handleClickOnSquare(e, letter, index){
  if(isWinGame) return;
  if(arrFlippedLetters.indexOf(letter) > -1) return;
  if(lastIndex == index) return;
  showFlippedLetter(index, letter);
  arrClickedLetter.push(letter);
  let l = arrClickedLetter.length;
  let prevLetter = arrClickedLetter[l - 2];
  let prev2Letter = arrClickedLetter[l - 3];
  if(prevLetter == letter) {
    arrFlippedLetters.push(letter);
    $flippedLettersNum.text(arrFlippedLetters.length);
    if(checkWinGame()){
      let result = new PlayingResult(timePassed, l);
      statistics.addResult(result);
      isWinGame = true;
      setTimeout(showAlertSuccess, 50);
    }
  }else if(prev2Letter != prevLetter) hideFlippedLetter(lastIndex);
  lastIndex = index;
  $flippedCount.text(l);
}

function setSizeGameArea(){
  let val = level/2;
  let width = 100*val;
  let gridTemplate = '';
  for(let i = 0; i < val; i++){
    gridTemplate += 'auto ';
  }
  $gameArea.css({
    width: `${width}px`,
    gridTemplateColumns: gridTemplate,
  })
}

function showFlippedLetter(index, letter){
  $gameArea.find('.square').eq(index).text(letter);
}
function hideFlippedLetter(index){
  $gameArea.find('.square').eq(index).text('');
}

function checkWinGame(){
  if(arrFlippedLetters.length == arrPlayingGameLetters.length/2) return true;
  return false;
}

function showAlertSuccess(){
  swal({
    title: "Good job!",
    text: "You have won this game!",
    icon: "success",
    timer: 6000
  });
}

function showAlertWarning(title, text, timer){
  swal({
    title: title,
    text: text,
    icon: "error",
    timer: timer
  });
}

function showModalChartStatistic(){
  if(statistics.resultsList.length == 0) return showAlertWarning("No data available", "");
  let $canvas = $('<canvas id="chart" height="400" class="mx-auto" style="min-width: 400px"></canvas>');
  renderChart($canvas);
  $('#modalStatistic').find('.modal-body').html($canvas);
  $('#modalStatistic').modal('show');
}

