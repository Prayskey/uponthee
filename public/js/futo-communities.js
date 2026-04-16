document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.save-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      
      btn.classList.toggle('saved');

      const icon = btn.querySelector('svg');

      if (btn.classList.contains('saved')) {
        icon.classList.remove('text-gray-600');
        icon.classList.add('text-red-500', 'fill-red-500');
      } else {
        icon.classList.remove('text-red-500', 'fill-red-500');
        icon.classList.add('text-gray-600');
      }
    });
  });
});