function uploadPickList() {
  const fileInput = document.getElementById("pdf");
  const supervisorInput = document.getElementById("supervisor");

  if (!fileInput.files.length) {
    alert("Please select a PDF file");
    return;
  }

  if (!supervisorInput.value.trim()) {
    alert("Please enter Supervisor name");
    return;
  }

  const formData = new FormData();
  formData.append("action", "upload");
  formData.append("supervisor", supervisorInput.value.trim());
  formData.append("file", fileInput.files[0]);

  fetch(CONFIG.API_URL, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert("Pick list uploaded successfully");
        location.reload();
      }
    })
    .catch(() => alert("Upload failed"));
}
