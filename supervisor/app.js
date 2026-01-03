document.addEventListener("DOMContentLoaded", loadPickLists);

/* ---------------- UPLOAD ---------------- */

function uploadPickList() {
  const file = document.getElementById("pdf").files[0];
  const supervisor = document.getElementById("supervisor").value.trim();

  if (!file) {
    alert("Please select a PDF file");
    return;
  }
  if (!supervisor) {
    alert("Please enter Supervisor name");
    return;
  }

  const formData = new FormData();
  formData.append("action", "upload");
  formData.append("supervisor", supervisor);
  formData.append("file", file);

  fetch(CONFIG.API_URL, {
    method: "POST",
    body: formData
  })
    .then(r => r.json())
    .then(res => {
      if (res.error) {
        alert(res.error);
      } else {
        alert("Pick list uploaded successfully");
        loadPickLists();
      }
    })
    .catch(() => alert("Upload failed"));
}

/* ---------------- LOAD LIST ---------------- */

function loadPickLists() {
  fetch(CONFIG.API_URL + "?action=list")
    .then(r => r.json())
    .then(renderTable)
    .catch(() => {
      document.getElementById("picklistTable").innerHTML =
        `<tr><td colspan="5">Failed to load data</td></tr>`;
    });
}

function renderTable(data) {
  const tbody = document.getElementById("picklistTable");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML =
      `<tr><td colspan="5" class="empty">No pick lists found</td></tr>`;
    return;
  }

  data.forEach(row => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${row.pickListId}</td>
      <td>${row.totalQty}</td>
      <td>${row.pickedQty}</td>
      <td>${row.status}</td>
      <td>${actionButtons(row)}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ---------------- ACTIONS ---------------- */

function actionButtons(row) {
  if (row.status === "OPEN") {
    return `
      <button class="btn-delete" onclick="deletePick('${row.pickListId}')">Delete</button>
      <button class="btn-close" onclick="forceClose('${row.pickListId}')">Close</button>
    `;
  }
  if (row.status === "WORKING") {
    return `
      <span class="locked">Locked</span>
      <button class="btn-close" onclick="forceClose('${row.pickListId}')">Close</button>
    `;
  }
  return `<span class="locked">Closed</span>`;
}

function deletePick(id) {
  if (!confirm(`Delete pick list ${id}? This cannot be undone.`)) return;

  fetch(`${CONFIG.API_URL}?action=delete&pickListId=${id}&user=Supervisor`)
    .then(r => r.json())
    .then(res => {
      if (res.error) alert(res.error);
      else loadPickLists();
    });
}

function forceClose(id) {
  const reason = prompt("Reason for closing this pick list:");
  if (!reason) return;

  fetch(
    `${CONFIG.API_URL}?action=forceClose&pickListId=${id}&user=Supervisor&reason=${encodeURIComponent(
      reason
    )}`
  )
    .then(r => r.json())
    .then(() => loadPickLists());
}
