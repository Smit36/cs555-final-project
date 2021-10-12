function showForm() {
  alert('hi');
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
  if (
    document.getElementById('points').value.length == 0 ||
    !Number(document.getElementById('points').value.length == 0)
  ) {
    document.getElementById('points-error').show();
    check = false;
  }
  if (document.getElementById('level').value.length == 0) {
    document.getElementById('level-error').show();
    check = false;
  }

  return check;
}
