const shuffle = document.getElementById('shuffle-button');
const repeat = document.getElementById('repeat-button');

shuffle.addEventListener('click', function() {
  this.classList.toggle('default-button');
});

repeat.addEventListener('click', function() {
    this.classList.toggle('default-button');
});