exports.sendToastr = (req, type, message) => {
  const options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-bottom-right',
  };

  switch (type) {
    case 'success':
      req.toastr.success(message, '', options);
      break;
    case 'warning':
      req.toastr.warning(message, '', options);
      break;
    case 'info':
      req.toastr.info(message, '', options);
      break;
    case 'error':
      req.toastr.error(message, '', options);
      break;
  }
};
