// 1. show the success message
const successMessage = document.querySelector(".success-message");
if (successMessage && window.Swal) {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: successMessage.textContent.trim(),
    confirmButtonColor: "#0e5a6f",
  });
  successMessage.remove();
}

// 2. ask before submitting forms
const confirmForms = document.querySelectorAll("form[data-confirm]");
confirmForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!window.Swal) {
      if (confirm(form.dataset.confirm)) form.submit();
      return;
    }

    Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: form.dataset.confirm,
      showCancelButton: true,
      confirmButtonText: form.dataset.confirmButton || "Yes",
      cancelButtonText: "No, go back",
      confirmButtonColor: "#b83a3a",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) form.submit();
    });
  });
});
