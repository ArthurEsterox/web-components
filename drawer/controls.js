const drawerLeft = document.getElementById('drawer-left');
const drawerRight = document.getElementById('drawer-right');

const openLeftButton = document.getElementById('open-left');
const openRightButton = document.getElementById('open-right');

openLeftButton.addEventListener('click', () => {
  drawerLeft.open();
});

openRightButton.addEventListener('click', () => {
  drawerRight.open();
});
