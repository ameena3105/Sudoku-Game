var fiveMinutes = 60 * 5;
var timer = 0;
var minutes = 0, seconds = 0, myTimer;
var globb;
var current_cell = null;
var sudokuboard = new Array(9);
var orginalboard = new Array(9);
var board = new Array(9);
Puzzle = new Array(9);
maxAttempts = 100;
var thisCol;
var thisRow;
var subMat;

// Table Creation on load
populateTable();

// Table of 9x9
function populateTable() {
  var i, j, tr, td;
  var table = document.getElementById('sudoku');
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);
  for (i = 0; i < 9; i++) {
    tr = document.createElement('tr');
    tbody.appendChild(tr);
    for (j = 0; j < 9; j++) {            
      td = document.createElement('td');
      tr.appendChild(td);
      td.setAttribute("id", "cell_"+ i +"_"+ j);
    }
  }
}

var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var levelModal = document.getElementById("gameLevelModal");
var overModal = document.getElementById("gameOverModal");
var completedModal = document.getElementById("gameCompletedModal");
var gameBtn = document.getElementById("newGame");
var closeBtn = document.getElementsByClassName("close")[0];
var levelEasy = document.getElementById("levelEasy");
var levelMedium = document.getElementById("levelMedium");
var levelHard = document.getElementById("levelHard");
gameBtn.onclick = function() {
  levelModal.style.display = "block";
};

levelEasy.onclick = function() {
  newgame();
  level(45);
  levelModal.style.display = "none";
};
levelMedium.onclick = function() {
  newgame();
  level(35);
  levelModal.style.display = "none";
};
levelHard.onclick = function() {
  newgame();
  level(25);
  levelModal.style.display = "none";
};
closeBtn.onclick = function() {
  if(levelModal.style.display == "block")
	levelModal.style.display = "none";
  if(overModal.style.display == "block")
	overModal.style.display = "none";
  if(completedModal.style.display == "block")
	completedModal.style.display = "none";
};

function initialize() {
  var col, row;  
  for (row = 0; row <= 8; row++) {
    for (col = 0; col <= 8; col++) {
      var cell = document.getElementById("cell_" + row + "_" + col);
    }
  }
  document.onkeypress = keyPress;
}


function newgame() {
  problem();
  for (row = 0; row <= 8; row++) {
    sudokuboard[row] = new Array(9);
    orginalboard[row] = new Array(9);
    board[row] = new Array(9);
    for (col = 0; col <= 8; col++) {
      document.getElementById("cell_" + row + "_" + col).innerHTML = "";
      sudokuboard[row][col] = 0;
      orginalboard[row][col] = 0;
      board[row][col] = 0;
    }
  }
}

function level(lvl) {
  for (var i = 1; i <= lvl; ) {
    var k = rand();
    var l = rand();
    if (sudokuboard[k][l] == 0) {
      var x = Puzzle[k][l];
      random = "cell_" + k + "_" + l;
      document.getElementById(random).innerHTML = x;
      sudokuboard[k][l] = x;
      board[k][l] = x;
      i++;
    }
  }
  for (row = 0; row <= 8; row++) {
    for (col = 0; col <= 8; col++) {
      var cell = document.getElementById("cell_" + row + "_" + col);
      if (!parseInt(cell.innerHTML)) {
        cell.onclick = selectCell;
        cell.className = "tofill";
      } else {
        cell.onclick = notSelect;
        cell.className = "notfill";
      }
    }
  }
  resetGame();
  //stattime();
  startTimer();
}

function selectCell() {
  if (current_cell !== null) {
    current_cell.className = "tofill";
  }
  current_cell = this;
  globb = this;
  current_cell.className = "selected";
}

function notSelect() {
  if (current_cell !== null) {
    current_cell.className = "notfill";
  }
  current_cell = "";
}

function problem() {
  count = 101;
  while (count > maxAttempts) {
    for (var m = 0; m < 9; m++) {
      Puzzle[m] = new Array(9);
      for (var n = 0; n < 9; n++) {
        Puzzle[m][n] = 0;
      }
    }

    for (row = 0; row < 9; row++) {
      for (col = 0; col < 9; col++) {
        thisRow = Puzzle[row];
        thisCol = new Array();
        for (row1 = 0; row1 < 9; row1++) {
          thisCol.push(Puzzle[row1][col]);
        }
        subRow = parseInt(row / 3);
        subCol = parseInt(col / 3);
        subMat = new Array();
        for (subR = 0; subR < 3; subR++) {
          for (subC = 0; subC < 3; subC++) {
            subMat.push(Puzzle[subRow * 3 + subR][subCol * 3 + subC]);
          }
        }
        randVal = 0;
        count = 0;
        while (validd(randVal, thisRow, thisCol, subMat)) {
          randVal = rand();
          if (randVal == 0) randVal = 9;
          count += 1;
          if (count > maxAttempts) {
            break;
          }
        }
        Puzzle[row][col] = randVal;
        if (count > maxAttempts) {
          break;
        }
      }
      if (count > maxAttempts) {
        break;
      }
    }
  }
}

function rand() {
  var r1 = Math.floor(Math.random() * 10);
  r1 = (r1 + r1 + 1) % 9;
  return r1;
}



function valid(k, l, r1) {
  var k1 = Math.floor(k / 3) * 3;
  var k2 = k1 + 3;
  var l1 = Math.floor(l / 3) * 3;
  var l2 = l1 + 3;
  for (i = k1; i < k2; i++) {
    for (j = l1; j < l2; j++) {
      if (sudokuboard[i][j] == r1) return 0;
    }
  }
  for (m = 0; m < 9; m++) {
    if ((sudokuboard[k][m] == r1) | (sudokuboard[m][l] == r1)) return 0;
  }
  return 1;
}


function validd(randVal, thisRow, thisCol, subMat) {
  for (i = 0; i < 9; i++) {
    if (thisRow[i] == randVal) {
      return 1;
    } else if (thisCol[i] == randVal) {
      return 1;
    } else if (subMat[i] == randVal) {
      return 1;
    } else {
      continue;
    }
  }
  return 0;
}

function startTimer() {
    timer = fiveMinutes;
	clearInterval(myTimer);
    myTimer = setInterval(gamerTimer, 1000);
	function gamerTimer() {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        //display.textContent = minutes + ":" + seconds;
		minutesLabel.innerHTML = minutes;
		secondsLabel.innerHTML = seconds;

        if (--timer < 0) {
            timer = fiveMinutes;
			clearInterval(myTimer);
			overModal.style.display = "block";
			solve();
		}
	}
}

function solve() {
  for (row = 0; row <= 8; row++) {
    for (col = 0; col <= 8; col++) {
      var val = Puzzle[row][col];
      document.getElementById("cell_" + row + "_" + col).innerHTML = val;
      sudokuboard[row][col] = val;
    }
  }
}

function keyPress(evt) {
  var key;

  if (evt) key = String.fromCharCode(evt.charCode);
  else key = String.fromCharCode(event.keyCode);
  if (key == " ") current_cell.innerHTML = "";
  else if (key >= 1 && key <= 9) {
    var log = globb.id;
    var rr = log.charAt(5);
    var cc = log.charAt(7);

    for (var i = 0; i < 9; i++) {
      var cell = "cell_" + i + "_" + cc;
    }

    var chk = valid(rr, cc, key);
    if (chk == 1) {
      current_cell.innerHTML = key;
      sudokuboard[rr][cc] = key;
      current_cell.className = "filled";
      if (isfull()) {
        completedModal.style.display = "block";
      }
    } 
	else{
		current_cell.className = "red";
	}
  }
}

function isfull() {
  for (row = 0; row <= 8; row++) {
    for (col = 0; col <= 8; col++) {
      var cell = document.getElementById("cell_" + row + "_" + col);
      if (!parseInt(cell.innerHTML)) {
        return 0;
      }
    }
  }
  return 1;
}

function resetGame() {
  initialize();
  for (row = 0; row <= 8; row++) {
    for (col = 0; col <= 8; col++) {
      sudokuboard[row][col] = board[row][col];
      cell = document.getElementById("cell_" + row + "_" + col);
      var v = board[row][col];
      if (v == 0)
        document.getElementById("cell_" + row + "_" + col).innerHTML = "";
      else document.getElementById("cell_" + row + "_" + col).innerHTML = v;
      if (!parseInt(cell.innerHTML)) {
        cell.onclick = selectCell;
        cell.className = "tofill";
      } else cell.className = "notfill";
    }
  }
}
