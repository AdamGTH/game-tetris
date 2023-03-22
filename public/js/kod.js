var col = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"];
var row = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];
var busy = [[]]; // tablica przechowująca binarny obraz planszy
var line_row = 3;
var line_col = 2;
var tim = 0;
let acceleration_time = 500;
let time_level = 500;
const figures = ["elkaL", "elkaR", "line", "square", "eta", "fourL", "fourR"];
let num_figure = getRandomInt(7);
let pos = ["pos1", "pos2", "pos3", "pos4"];
let num_pos = 0;
let scores = 0;
let level = 1;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function load_tab() {
  for (i = 0; i < row.length; i++)
    busy[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

window.addEventListener("keyup", (event) => {
  if (event.key == "ArrowDown") acceleration_time = time_level;
});

window.addEventListener(
  "keydown",
  (event) => {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    switch (event.key) {
      case "Down": // IE/Edge specific value
      case "ArrowDown":
        // Do something for "down arrow" key press.
        acceleration_time = 90;
        break;
      case "Up": // IE/Edge specific value
      case "ArrowUp":
        changePosition();
        // Do something for "up arrow" key press.
        break;
      case "Left": // IE/Edge specific value
      case "ArrowLeft":
        turn_left();
        // Do something for "left arrow" key press.
        break;
      case "Right": // IE/Edge specific value
      case "ArrowRight":
        turn_right();
        // Do something for "right arrow" key press.
        break;
      // case "Enter":
      //   // Do something for "enter" or "return" key press.
      //   break;
      // case "Esc": // IE/Edge specific value
      // case "Escape":
      //   // Do something for "esc" key press.
      //   break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    //console.log(event.key);
    event.preventDefault();
  },
  true
);

function on_load() {
  load_tab();
  clear_table();
  setTimeout(main, 1000);
}

window.onload = on_load;

function clear_table() {
  var zm = "";
  var i = 0;
  var j = 0;
  document.querySelector(".scores").innerHTML = `<span>SCORE:${scores}</span>`;
  document.querySelector(".level").innerHTML = `<span>LEVEL:${level}</span>`;

  for (j = 0; j < col.length; j++) {
    if (j == col.length - 1) {
      zm = zm + '<div id="' + col[j] + row[i] + '"' + ' class="pole" ></div>';
      i++;
      if (i == row.length) break;
      j = 0;
      zm =
        zm +
        '<div id="' +
        col[j] +
        row[i] +
        '"' +
        ' style="clear: both;" class="pole" ></div>';
    } else {
      zm = zm + '<div id="' + col[j] + row[i] + '"' + ' class="pole" ></div>';
    }
  }
  document.getElementById("tetris").innerHTML = zm;
}

function print_square(a, idx_letter) {
  if (a)
    document.getElementById(idx_letter).innerHTML = '<div id="kwadrat"></div>';
  else
    document.getElementById(idx_letter).innerHTML =
      '<div id="kwadrat" style = "background-color: rgb(90, 65, 65);" ></div>';
}

function main() {
  // główna funkcja programu

  tim = setTimeout(main, acceleration_time);

  if (
    control(figures[num_figure], pos[num_pos], line_col, line_row, "ctrl_row")
  ) {
    figureOperation(
      figures[num_figure],
      pos[num_pos],
      line_col,
      line_row,
      "save"
    );
    
    line_row = 0;
    line_col = col.length / 2;
    if (clear_and_sort()) {
      clear_table();
      print_table();
    }
  }

  figureOperation(
    figures[num_figure],
    pos[num_pos],
    line_col,
    line_row,
    "clear"
  );
  figureOperation(
    figures[num_figure],
    pos[num_pos],
    line_col,
    line_row,
    "draw"
  );

  if (line_row == 0) {
    if(busy[line_row][line_col] == 1){  // koniec gry
      clearTimeout(tim);
      game_over();
    }
     
  }
  line_row++;
}

function pause() {
  clearTimeout(tim);
}

function game_over() {
  document.getElementById("tetris").innerHTML =
    "<span style = 'font-size: 72px;'>GAME OVER</span><div class='buttons'><button class='btn' onclick='on_load()'><i>try again</i></button></div>";
}

function changePosition() {
  clearTimeout(tim);
  figureOperation(
    figures[num_figure],
    pos[num_pos],
    line_col,
    line_row,
    "clear"
  );
  let prev_pos = num_pos;
  line_row--;
  num_pos++;
  if (num_pos > 3) num_pos = 0;
  if (
    figureOperation(
      figures[num_figure],
      pos[num_pos],
      line_col,
      line_row,
      "change_position"
    )
  )
    num_pos = prev_pos;

  setTimeout(main, 5);
}
function turn_left() {
  clearTimeout(tim);
  figureOperation(
    figures[num_figure],
    pos[num_pos],
    line_col,
    line_row,
    "clear"
  );
  line_row--;
  if (line_row < 0) line_row = 0;
  if (
    !borderControl(
      figures[num_figure],
      pos[num_pos],
      line_col,
      line_row,
      "col_left"
    )
  ) {
    line_col--;
    if (border_col_LR[figures[num_figure]][pos[num_pos]][0] < 0) {
      if (line_col + border_col_LR[figures[num_figure]][pos[num_pos]][0] < 0)
        line_col = Math.abs(
          border_col_LR[figures[num_figure]][pos[num_pos]][0]
        );
    } else if (line_col < 0) line_col = 0;
  } else {
    setTimeout(main, 5);
    return;
  }

  setTimeout(main, 5);
}

function turn_right() {
  clearTimeout(tim);
  figureOperation(
    figures[num_figure],
    pos[num_pos],
    line_col,
    line_row,
    "clear"
  );
  line_row--;
  if (line_row < 0) line_row = 0;

  if (
    !borderControl(
      figures[num_figure],
      pos[num_pos],
      line_col,
      line_row,
      "col_right"
    )
  ) {
    line_col++;
    if (border_col_LR[figures[num_figure]][pos[num_pos]][1] > 0) {
      if (
        line_col + border_col_LR[figures[num_figure]][pos[num_pos]][1] >=
        col.length
      )
        line_col =
          col.length - 1 - border_col_LR[figures[num_figure]][pos[num_pos]][1];
    } else if (line_col >= col.length) line_col = col.length - 1;
  } else {
    setTimeout(main, 5);
    return;
  }

  setTimeout(main, 5);
}

function control(figure, position, c_base, r_base, ctrl_item) {
  if (line_row > row.length - 1) return 1;

  return borderControl(figure, position, c_base, r_base, ctrl_item);
}

function clear_and_sort() {
  var flag = 0;
  var count = 0;
  var r = 0;
  var c = 0;
  let sort_row = true;

  for (r = row.length - 1; r; r--) {
    count = 0;
    if (sort_row == true)
      // jesli w poprzedniej iteracji został wykryty cały rząd
      r = row.length - 1; //zacznij znów od początku

    for (c = 0; c < col.length; c++) {
      if (busy[r][c] == 1) {
        count++;
        if (count == col.length) {
          sort_row = true;
          flag = 1;
          count = 0;
          scores += 10; // dodanie punktów za skasowanie rzędu
          for (j = 0; j < r; j++) {
            //pętla sortująca
            busy[r - j] = busy[r - 1 - j];
          }
          busy[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
      } else sort_row = false;
    }
  }

  if (scores > 50) {
    // w przypadku zwiększenia poziomu trudności
    scores = 0;
    level += 1;
    acceleration_time -= 10;
    time_level -= 10;
  }

  document.querySelector(".scores").innerHTML = `<span>SCORE:${scores}</span>`;
  document.querySelector(".level").innerHTML = `<span>LEVEL:${level}</span>`;

  return flag;
}

function print_table() {
  for (r = 0; r < row.length; r++) {
    for (c = 0; c < col.length; c++) {
      if (busy[r][c] == 1) print_square(1, col[c] + row[r]);
      else print_square(0, col[c] + row[r]);
    }
  }
}

function figureOperation(figure, position, c_base, r_base, operation) {
  let r, c, square;

  if (operation == "clear" || operation == "save") {
    square = 0;
    if (r_base > 0) r_base -= 1;
  } else square = 1;

  for (count = 0; count < 4; count++) {
    c = c_base + get_direction(figure, count, "col", position);
    r = r_base + get_direction(figure, count, "row", position);
    if (r >= 0 && r < row.length) {
      if (operation == "save") busy[r][c] = 1;
      else if (operation == "clear" || operation == "draw") {
        if (busy[r][c] != 1) print_square(square, col[c] + row[r]);
      } else if (operation == "change_position") {
        if (busy[r][c] == 1 || c < 0 || c >= col.length) return 1;
      }
    }
  }
  if (operation == "save") {
    num_figure = getRandomInt(7); //losowanie figur
  }

  return 0;
}

function borderControl(figure, position, c_base, r_base, ctrl_item) {
  let point, r, l;

  let num_ctrl_points_rows = {
    elkaL: { pos1: 2, pos2: 3, pos3: 2, pos4: 3 },
    elkaR: { pos1: 2, pos2: 3, pos3: 2, pos4: 3 },
    line: { pos1: 1, pos2: 4, pos3: 1, pos4: 4 },
    square: { pos1: 2, pos2: 2, pos3: 2, pos4: 2 },
    eta: { pos1: 3, pos2: 2, pos3: 3, pos4: 2 },
    fourL: { pos1: 2, pos2: 3, pos3: 2, pos4: 3 },
    fourR: { pos1: 2, pos2: 3, pos3: 2, pos4: 3 },
  };

  let num_ctrl_points_col = {
    elkaL: { pos1: 3, pos2: 2, pos3: 3, pos4: 2 },
    elkaR: { pos1: 3, pos2: 2, pos3: 3, pos4: 2 },
    line: { pos1: 4, pos2: 1, pos3: 4, pos4: 1 },
    square: { pos1: 2, pos2: 2, pos3: 2, pos4: 2 },
    eta: { pos1: 2, pos2: 3, pos3: 2, pos4: 3 },
    fourL: { pos1: 3, pos2: 2, pos3: 3, pos4: 2 },
    fourR: { pos1: 3, pos2: 2, pos3: 3, pos4: 2 },
  };

  if (ctrl_item == "ctrl_row") point = num_ctrl_points_rows[figure][position];
  else point = num_ctrl_points_col[figure][position];

  for (x = 0; x < point; x++) {
    r = r_base + get_ctrl_point(figure, x, "row", position, ctrl_item);
    c = c_base + get_ctrl_point(figure, x, "col", position, ctrl_item);
    if (r >= 0 && r < row.length) {
      if (busy[r][c] == 1) {
        return 1;
      }
    }
  }
  return 0;
}

let points_to_control_row = {}; // first declaration

function get_ctrl_point(figure, count, row_col, position, ctrl_item) {
  let type;
  if (row_col == "row") type = 0;
  else type = 1;

  if (ctrl_item == "ctrl_row")
    return points_to_control_row[figure][position][count][type];
  else if (ctrl_item == "col_left")
    return pointsCtrlColLeft[figure][position][count][type];
  else if (ctrl_item == "col_right")
    return pointsCtrlColRight[figure][position][count][type];
}

function get_direction(figure, count, row_col, position) {
  let type;
  if (row_col == "row") type = 0;
  else type = 1;

  return figuresy.get(figure).get(position)[count][type];
}

const border_col_LR = {
  //[size_left, size_right]
  elkaL: { pos1: [0, 1], pos2: [-1, 1], pos3: [-1, 0], pos4: [-1, 1] },
  elkaR: { pos1: [-1, 0], pos2: [-1, 1], pos3: [0, 1], pos4: [-1, 1] },
  line: { pos1: [0, 0], pos2: [-1, 2], pos3: [0, 0], pos4: [-2, 1] },
  square: { pos1: [0, 1], pos2: [0, 1], pos3: [0, 1], pos4: [0, 1] },
  eta: { pos1: [-1, 1], pos2: [-1, 0], pos3: [-1, 1], pos4: [0, 1] },
  fourL: { pos1: [-1, 0], pos2: [-1, 1], pos3: [-1, 0], pos4: [-1, 1] },
  fourR: { pos1: [0, 1], pos2: [-1, 1], pos3: [0, 1], pos4: [-1, 1] },
}; // first T - from left to right

points_to_control_row = {
  elkaL: {
    pos1: [
      [0, 0],
      [0, 1],
    ],
    pos2: [
      [0, 0],
      [0, -1],
      [0, 1],
    ],
    pos3: [
      [0, 0],
      [-2, -1],
    ],
    pos4: [
      [0, -1],
      [-1, 0],
      [-1, 1],
    ],
  },

  elkaR: {
    pos1: [
      [0, 0],
      [0, -1],
    ],
    pos2: [
      [0, 0],
      [0, -1],
      [0, 1],
    ],
    pos3: [
      [0, 0],
      [-2, 1],
    ],
    pos4: [
      [0, 1],
      [-1, 0],
      [-1, -1],
    ],
  },

  line: {
    pos1: [[0, 0]],
    pos2: [
      [0, 0],
      [0, -1],
      [0, 1],
      [0, 2],
    ],
    pos3: [[0, 0]],
    pos4: [
      [0, 0],
      [0, 1],
      [0, -1],
      [0, -2],
    ],
  },

  square: {
    pos1: [
      [0, 0],
      [0, 1],
    ],
    pos2: [
      [0, 0],
      [0, 1],
    ],
    pos3: [
      [0, 0],
      [0, 1],
    ],
    pos4: [
      [0, 0],
      [0, 1],
    ],
  },

  eta: {
    pos1: [
      [0, 0],
      [0, 1],
      [0, -1],
    ],
    pos2: [
      [0, 0],
      [-1, -1],
    ],
    pos3: [
      [0, 0],
      [-1, -1],
      [-1, 1],
    ],
    pos4: [
      [0, 0],
      [-1, 1],
    ],
  },

  fourL: {
    pos1: [
      [0, -1],
      [-1, 0],
    ],
    pos2: [
      [0, 0],
      [-1, -1],
      [0, 1],
    ],
    pos3: [
      [0, -1],
      [-1, 0],
    ],
    pos4: [
      [0, 0],
      [-1, -1],
      [0, 1],
    ],
  },

  fourR: {
    pos1: [
      [0, 1],
      [-1, 0],
    ],
    pos2: [
      [0, 0],
      [0, -1],
      [-1, 1],
    ],
    pos3: [
      [0, 1],
      [-1, 0],
    ],
    pos4: [
      [0, 0],
      [0, -1],
      [-1, 1],
    ],
  },
};

let pointsCtrlColLeft = {
  elkaL: {
    pos1: [
      [0, -1],
      [-1, -1],
      [-2, -1],
    ],
    pos2: [
      [0, -2],
      [-1, 0],
    ],
    pos3: [
      [0, -1],
      [-1, -1],
      [-2, -2],
    ],
    pos4: [
      [0, -2],
      [-1, -2],
    ],
  },

  elkaR: {
    pos1: [
      [0, -2],
      [-1, -1],
      [-2, -1],
    ],
    pos2: [
      [0, -2],
      [-1, -2],
    ],
    pos3: [
      [0, -1],
      [-1, -1],
      [-2, -1],
    ],
    pos4: [
      [0, 0],
      [-1, -2],
    ],
  },

  line: {
    pos1: [
      [0, -1],
      [0, -1],
      [0, -1],
      [0, -1],
    ],
    pos2: [[0, -2]],
    pos3: [
      [0, -1],
      [0, -1],
      [0, -1],
      [0, -1],
    ],
    pos4: [[0, -3]],
  },

  square: {
    pos1: [
      [0, -1],
      [-1, -1],
    ],
    pos2: [
      [0, -1],
      [-1, -1],
    ],
    pos3: [
      [0, -1],
      [-1, -1],
    ],
    pos4: [
      [0, -1],
      [-1, -1],
    ],
  },

  eta: {
    pos1: [
      [0, -2],
      [-1, -1],
    ],
    pos2: [
      [0, -1],
      [-1, -2],
      [-2, -1],
    ],
    pos3: [
      [0, -1],
      [-1, -2],
    ],
    pos4: [
      [0, -1],
      [-1, -1],
      [-2, -1],
    ],
  },

  fourL: {
    pos1: [
      [0, -2],
      [-1, -2],
      [-2, -1],
    ],
    pos2: [
      [0, -1],
      [-1, -2],
    ],
    pos3: [
      [0, -2],
      [-1, -2],
      [-2, -1],
    ],
    pos4: [
      [0, -1],
      [-1, -2],
    ],
  },

  fourR: {
    pos1: [
      [0, 0],
      [-1, -1],
      [-2, -1],
    ],
    pos2: [
      [0, -2],
      [-1, -1],
    ],
    pos3: [
      [0, 0],
      [-1, -1],
      [-2, -1],
    ],
    pos4: [
      [0, -2],
      [-1, -1],
    ],
  },
};

const pointsCtrlColRight = {
  elkaL: {
    pos1: [
      [0, 2],
      [-1, 1],
      [-2, 1],
    ],
    pos2: [
      [0, 2],
      [-1, 2],
    ],
    pos3: [
      [0, 1],
      [-1, 1],
      [-2, 1],
    ],
    pos4: [
      [0, 0],
      [-1, 2],
    ],
  },

  elkaR: {
    pos1: [
      [0, 1],
      [-1, 1],
      [-2, 1],
    ],
    pos2: [
      [0, 2],
      [-1, 0],
    ],
    pos3: [
      [0, 1],
      [-1, 1],
      [-2, 2],
    ],
    pos4: [
      [0, 2],
      [-1, 2],
    ],
  },

  line: {
    pos1: [
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ],
    pos2: [[0, 3]],
    pos3: [
      [0, 1],
      [0, 1],
      [0, 1],
      [0, 1],
    ],
    pos4: [[0, 2]],
  },

  square: {
    pos1: [
      [0, 2],
      [-1, 2],
    ],
    pos2: [
      [0, 2],
      [-1, 2],
    ],
    pos3: [
      [0, 2],
      [-1, 2],
    ],
    pos4: [
      [0, 2],
      [-1, 2],
    ],
  },

  eta: {
    pos1: [
      [0, 2],
      [-1, 1],
    ],
    pos2: [
      [0, 1],
      [-1, 1],
      [-2, 1],
    ],
    pos3: [
      [0, 1],
      [-1, 2],
    ],
    pos4: [
      [0, 1],
      [-1, 2],
      [-2, 1],
    ],
  },

  fourL: {
    pos1: [
      [0, 0],
      [-1, 1],
      [-2, 1],
    ],
    pos2: [
      [0, 2],
      [-1, 1],
    ],
    pos3: [
      [0, 0],
      [-1, 1],
      [-2, 1],
    ],
    pos4: [
      [0, 2],
      [-1, 1],
    ],
  },

  fourR: {
    pos1: [
      [0, 2],
      [-1, 2],
      [-2, 1],
    ],
    pos2: [
      [0, 1],
      [-1, 2],
    ],
    pos3: [
      [0, 2],
      [-1, 2],
      [-2, 1],
    ],
    pos4: [
      [0, 1],
      [-1, 2],
    ],
  },
};

const pos_elka_left = new Map([
  [
    "pos1",
    [
      [0, 0],
      [0, 1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, -1],
      [0, 1],
      [-1, 1],
    ],
  ],
  [
    "pos3",
    [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-2, -1],
    ],
  ],
  [
    "pos4",
    [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
  ],
]);

const pos_elka_right = new Map([
  [
    "pos1",
    [
      [0, 0],
      [0, -1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, 1],
      [0, -1],
      [-1, -1],
    ],
  ],
  [
    "pos3",
    [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-2, 1],
    ],
  ],
  [
    "pos4",
    [
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ],
  ],
]);

const pos_line = new Map([
  [
    "pos1",
    [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, -1],
      [0, 1],
      [0, 2],
    ],
  ],
  [
    "pos3",
    [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-3, 0],
    ],
  ],
  [
    "pos4",
    [
      [0, 0],
      [0, -1],
      [0, -2],
      [0, 1],
    ],
  ],
]);

const pos_square = new Map([
  [
    "pos1",
    [
      [0, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ],
  ],
  [
    "pos3",
    [
      [0, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ],
  ],
  [
    "pos4",
    [
      [0, 0],
      [0, 1],
      [-1, 1],
      [-1, 0],
    ],
  ],
]);

const pos_eta = new Map([
  [
    "pos1",
    [
      [0, 0],
      [0, 1],
      [0, -1],
      [-1, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [-1, 0],
      [-2, 0],
      [-1, -1],
    ],
  ],
  [
    "pos3",
    [
      [0, 0],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ],
  ],
  [
    "pos4",
    [
      [0, 0],
      [-1, 1],
      [-1, 0],
      [-2, 0],
    ],
  ],
]);

const pos_fourL = new Map([
  [
    "pos1",
    [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, 1],
      [-1, 0],
      [-1, -1],
    ],
  ],
  [
    "pos3",
    [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos4",
    [
      [0, 0],
      [0, 1],
      [-1, 0],
      [-1, -1],
    ],
  ],
]);

const pos_fourR = new Map([
  [
    "pos1",
    [
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos2",
    [
      [0, 0],
      [0, -1],
      [-1, 0],
      [-1, 1],
    ],
  ],
  [
    "pos3",
    [
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-2, 0],
    ],
  ],
  [
    "pos4",
    [
      [0, 0],
      [0, -1],
      [-1, 0],
      [-1, 1],
    ],
  ],
]);

const figuresy = new Map([
  ["elkaL", pos_elka_left],
  ["elkaR", pos_elka_right],
  ["line", pos_line],
  ["square", pos_square],
  ["eta", pos_eta],
  ["fourL", pos_fourL],
  ["fourR", pos_fourR],
]);
