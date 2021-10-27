function showForm() {
  const form = document.getElementById('taskForm');
  let task = document.querySelector('#createTask');
  if (task.innerHTML == 'Create Task') {
    if (document.querySelector('#success')) {
      document.querySelector('#success').style.display = 'none';
    }
    task.innerHTML = 'Close Form';
  } else {
    if (document.querySelector('#success')) {
      document.querySelector('#success').style.display = 'none';
    }
    task.innerHTML = 'Create Task';
  }
  if (form.style.display === 'none') {
    form.style.display = 'block';
  } else {
    form.style.display = 'none';
  }
}

function checkValidation() {
  let check = true;
  if (document.getElementById('name').value.length == 0) {
    document.getElementById('name-error').show();
    check = false;
  }
  if (document.getElementById('description').value.length == 0) {
    document.getElementById('description-error').show();
    check = false;
  }
  if (!document.getElementById('points') || !Number(document.querySelector('#points').value)) {
    document.getElementById('points-error').show();
    check = false;
  }
  if (!document.getElementById('level') || !Number(document.querySelector('#level').value)) {
    document.getElementById('level-error').show();
    check = false;
  }

  return check;
}

let level = document.getElementById('level').innerHTML;
let new_row = document.createElement('div');
new_row.className = 'row';

for (let i = 1, j = 1; i <= level; i = j * 5, j++) {
  let new_div = document.createElement('img');
  new_div.className = 'badge_img';
  console.log('/public/badgeImages/level' + i + 'BadgeCircleModified.png');
  new_div.src = '/public/badgeImages/level' + i + 'BadgeCircleModified.png';

  let new_col = document.createElement('div');
  new_col.className = 'col-lg-2';

  new_col.appendChild(new_div);
  new_row.appendChild(new_col);
}

document.getElementsByClassName('badges')[0].appendChild(new_row);
