document.addEventListener("DOMContentLoaded", () => {
  loadPickLists();
  // refresh list after upload
  setInterval(loadPickLists, 3000);
});

function loadPickLists() {
  fetch(CONFIG.API_URL + "?action=list")
    .then(r => r.json())
    .then(renderTable)
    .catch(() => {});
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
        <td>${actions(row)}</td>
      </tr>`;
  });
}

function actions(row) {
  if (row.status === "OPEN") {
    return `
      <button onclick="deletePick('${row.pickListId}')">Delete</button>
      <button onclick="forceClose('${row.pickListId}')">Close</button>
    `;
  }
  if (row.status === "WORKING") {
    return `<button onclick="forceClose('${row.pickListId}')">Close</button>`;
  }
  return "Closed";
}

function deletePick(id) {
  if (!confirm(`Delete pick list ${id}?`)) return;
  fetch(`${CONFIG.API_URL}?action=delete&pickListId=${id}&user=Supervisor`)
    .then(() => loadPickLists());
}

function forceClose(id) {
  const reason = prompt("Reason for closing:");
  if (!reason) return;

  fetch(
    `${CONFIG.API_URL}?action=forceClose&pickListId=${id}&user=Supervisor&reason=${encodeURIComponent(reason)}`
  )
    .then(() => loadPickLists());
}
