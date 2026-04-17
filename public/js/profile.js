let editing = false;
const editableFields = ['first_name','last_name','phone','dob','gender','location','bio'];

function toggleEdit() {
  editing = !editing;
  const label = document.getElementById('edit-label');
  const saveRow = document.getElementById('save-row');

  label.textContent = editing ? 'Cancel' : 'Edit profile';
  saveRow.style.display = editing ? 'flex' : 'none';

  editableFields.forEach(id => {
    const el = document.getElementById('f-' + id);
    if (!el) return;
    if (el.tagName === 'SELECT') {
      el.disabled = !editing;
    } else {
      if (editing) el.removeAttribute('readonly');
      else el.setAttribute('readonly', '');
    }
    el.style.background = editing ? 'white' : '';
    el.style.color = editing ? '#111827' : '';
  });

  if (!editing) {
    // re-disable fields on cancel
    editableFields.forEach(id => {
      const el = document.getElementById('f-' + id);
      if (el) { el.setAttribute('readonly', ''); el.style.background = ''; }
    });
  }
}

// Form submit
document.getElementById('profile-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const btn = document.getElementById('save-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const formData = new FormData(this);
  try {
    const res = await fetch('/profile/update', {
      method: 'POST',
      credentials: 'same-origin',
      body: formData,
    });
    if (res.ok) {
      showToast('Profile updated successfully.', 'success');
      toggleEdit();
    } else {
      showToast('Failed to update. Please try again.', 'error');
    }
  } catch {
    showToast('Something went wrong.', 'error');
  } finally {
    btn.textContent = 'Save changes';
    btn.disabled = false;
  }
});

// Avatar preview
function previewAvatar(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('avatar-img').src = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
}

function showToast(msg, type) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => { t.className = 'toast'; }, 3500);
}
