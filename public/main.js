function showForm() {
  document.querySelector('#success').style.display = 'none';
  const form = document.getElementById('taskForm');
  let task = document.querySelector('#createTask');
  if (task.innerHTML == 'Create Task') {
    task.innerHTML = 'Close Form';
  } else {
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
