function upload() {
  const file = document.getElementById("pdf").files[0];
  const supervisor = document.getElementById("supervisor").value;
  const form = new FormData();
  form.append("action", "upload");
  form.append("supervisor", supervisor);
  form.append("file", file);

  fetch(CONFIG.API_URL, { method: "POST", body: form })
    .then(r => r.json())
    .then(() => alert("Uploaded successfully"));
}