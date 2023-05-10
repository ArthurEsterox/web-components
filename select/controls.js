const select = document.getElementById('custom-select');

select.addEventListener('custom-select', (e) => {
  select.setAttribute('value', e.detail);
});
