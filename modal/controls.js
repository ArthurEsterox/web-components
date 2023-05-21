const openModalButton = document.getElementById('open-modal');

openModalButton.addEventListener('click', () => {
  const modal = document.createElement('custom-modal');
  modal.innerHTML = `
    <custom-modal-header>
      Modal title
    </custom-modal-header>

    <custom-modal-content>
      <p class="modal-content">
        Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        <br /><br />
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        <br /><br />
        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.
      </p>
    </custom-modal-content>

    <custom-modal-footer
      submit="Submit"
      cancel="Cancel"
    ></custom-modal-footer>
  `;

  modal.addEventListener('delete', (e) => {
    e.target.remove();
  });

  modal.addEventListener('modal-submit', (e) => {
    alert('Submit!');

    modal.close();
  });

  document.body.appendChild(modal);
});
