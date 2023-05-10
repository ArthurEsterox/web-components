const notification = document.getElementById('notification');
const notificationHeader = document.getElementById('notification-header');
const notificationMessage = document.getElementById('notification-message');
const notificationFooter = document.getElementById('notification-footer');

const messageInput = document.getElementById('message');
const headerInput = document.getElementById('header');
const footerInput = document.getElementById('footer');
const borderColorInput = document.getElementById('border-color');
const imageInput = document.getElementById('image');
const hideModeSelect = document.getElementById('hide-mode');
const countInput = document.getElementById('count');
const countColorInput = document.getElementById('count-color');

messageInput.addEventListener('input', (e) => {
  notificationMessage.textContent = e.target.value;
});

headerInput.addEventListener('input', (e) => {
  notificationHeader.textContent = e.target.value;
});

footerInput.addEventListener('input', (e) => {
  notificationFooter.textContent = e.target.value;
});

borderColorInput.addEventListener('input', (e) => {
  notification.setAttribute('border-color', e.target.value);
});

imageInput.addEventListener('input', (e) => {
  notification.setAttribute('image', e.target.value);
});

hideModeSelect.addEventListener('change', (e) => {
  notification.setAttribute('hide-mode', e.target.value);
});

countInput.addEventListener('input', (e) => {
  notification.setAttribute('count', e.target.value);
});

countColorInput.addEventListener('input', (e) => {
  notification.setAttribute('count-color', e.target.value);
});

notification.addEventListener('delete', () => {
  notification.remove();
});

notification.addEventListener('minimize', () => {
  // ...
});

notification.addEventListener('maximize', () => {
  // ...
});
