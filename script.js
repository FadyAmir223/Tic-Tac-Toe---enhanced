let boxs = document.querySelectorAll('.board span'),
  winner = document.querySelector('.win span'),
  players = document.querySelectorAll('.player'),
  symbols = document.querySelectorAll('.symbol'),
  lego = document.querySelectorAll('.ctr'),
  btn = document.getElementsByTagName('button')[0];

let box2D, turn, player;
const width = 3,
  data = { 0: 'X', 1: 'O' },
  size = {
    small: { ctr: 5, weight: 0 },
    medium: { ctr: 3, weight: 1 },
    large: { ctr: 2, weight: 2 },
  };

init();

symbols.forEach((i) => {
  i.textContent = i.parentElement.parentElement.classList.contains(data[0])
    ? data[0]
    : data[1];
});
lego.forEach(
  (i) => (i.textContent = size[i.parentElement.classList[0]]['ctr'])
);

function init() {
  turn = 0;
  player = data[turn];
  box2D = new Array(width).fill('').map((_) => new Array(width));
  document.querySelector(`.${player}`).classList.add('turn');
  players.forEach((i) => i.children[0].classList.add('selected'));
}

btn.onclick = (_) => {
  players.forEach((i) =>
    [...i.children].forEach((j) => j.classList.remove('selected'))
  );
  init();
  winner.parentElement.style.opacity = '0';
  document.querySelector(`.${data[turn + 1]}`).classList.remove('turn');
  lego.forEach(
    (i) => (i.textContent = size[i.parentElement.classList[0]]['ctr'])
  );

  boxs.forEach((i) => {
    i.style.pointerEvents = 'auto';
    i.removeAttribute('data-symbol');
    i.removeAttribute('data-size');
    i.textContent = '';
  });
};

boxs.forEach((i, idx) => {
  i.onclick = (_) => {
    let selected = document.querySelector(`.${player} .selected`);

    document.querySelector(`.${player} .selected .ctr`).textContent--;
    document.querySelector(`.${player}`).classList.toggle('turn');

    i.setAttribute('data-symbol', player);
    i.setAttribute('data-size', selected.classList[0]);
    i.textContent = player;

    let row = Math.trunc(idx / width),
      col = idx - row * width;
    box2D[row][col] = player;

    if (win(row, col, player)) {
      boxs.forEach((j) => (j.style.pointerEvents = 'none'));
      winner.textContent = player;
      winner.setAttribute('data-symbol', player);
      winner.parentElement.style.opacity = '1';
    } else {
      player = data[++turn % 2];
      document.querySelector(`.${player}`).classList.toggle('turn');
      setCursor();
    }
  };
});

function setCursor() {
  let selected = document.querySelector(`.${player} .selected`),
    nextWeight = size[selected.classList[0]]['weight'];

  boxs.forEach((i) => {
    let currentWeight = i.hasAttribute('data-size')
        ? size[i.dataset.size]['weight']
        : -1,
      remain = document.querySelector(`.${player} .selected .ctr`);

    i.style.pointerEvents = 'none';
    if (
      remain.textContent - 1 >= 0 &&
      nextWeight > currentWeight &&
      i.dataset.symbol != player
    )
      i.style.pointerEvents = 'auto';
  });
}

function win(row, col, player) {
  if (turn > 3) {
    let ctrR = 0,
      ctrC = 0,
      ctrD = 0,
      ctrDr = 0;

    for (let i = 0; i < width; i++) {
      if (box2D[row][i] == player) ctrR++;
      if (box2D[i][col] == player) ctrC++;
      if (box2D[i][i] == player) ctrD++;
      if (box2D[i][width - 1 - i] == player) ctrDr++;
    }

    if (ctrR == width || ctrC == width || ctrD == width || ctrDr == width)
      return true;
  }
  return false;
}

players.forEach((i) => {
  i.children[0].classList.add('selected');

  [...i.children].forEach((j) => {
    j.onclick = (_) => {
      [...j.parentElement.children].forEach((k) => {
        if (i.classList.contains(player)) k.classList.remove('selected');
      });

      if (i.classList.contains(player)) j.classList.add('selected');

      setCursor();
    };
  });
});
