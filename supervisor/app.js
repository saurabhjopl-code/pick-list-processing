document.addEventListener("DOMContentLoaded", loadPickLists);

function processPickList() {
  const driveLink = document.getElementById("driveLink").value.trim();
  const supervisor = document.getElementById("supervisor").value.trim();

  if (!driveLink) {
    alert("Please paste Google Drive PDF link");
    return;
  }
  if (!supervisor) {
    alert("Please enter Supervisor name");
    return;
  }

  fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "processDrivePdf",
      driveLink,
      supervisor
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.error) alert(res.error);
      else {
        alert("Pick list processed successfully");
        loadPickLists();
      }
    })
    .catch(() => alert("Upload failed"));
}

function loadPickLists() {
  fetch(CONFIG.API_URL + "?action=list")
    .then(r => r.json())
    .then(renderTable);
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
    tbody.innerHTML += `
      <tr>
        <td>${row.pickListId}</td>
        <td>${row.totalQty}</td>
        <td>${row.pickedQty}</td>
        <td>${row.status}</td>
        <td>${actionButtons(row)}</td>
      </tr>`;
  });
}

function actionButtons(row) {
  if (row.status === "OPEN") {
    return `
      <button onclick="deletePick('${row.pickListId}')">Delete</button>
      <button onclick="forceClose('${row.pickListId}')">Close</button>`;
  }
  if (row.status === "WORKING") {
    return `<button onclick="forceClose('${row.pickListId}')">Close</button>`;
  }
  return "Closed";
}

function deletePick(id) {
  fetch(`${CONFIG.API_URL}?action=delete&pickListId=${id}&user=Supervisor`)
    .then(r => r.json())
    .then(() => loadPickLists());
}

function forceClose(id) {
  const reason = prompt("Reason for closing:");
  if (!reason) return;

  fetch(
    `${CONFIG.API_URL}?action=forceClose&pickListId=${id}&user=Supervisor&reason=${encodeURIComponent(reason)}`
  )
    .then(r => r.json())
    .then(() => loadPickLists());
}
