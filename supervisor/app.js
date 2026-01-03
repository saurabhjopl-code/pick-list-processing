document.addEventListener("DOMContentLoaded", loadPickLists);

function onUploadStart() {
  const status = document.getElementById("uploadStatus");
  status.textContent = "Uploading pick list… please wait";

  // refresh list after upload finishes
  setTimeout(loadPickLists, 3000);
}

function loadPickLists() {
  fetch("https://script.google.com/macros/s/AKfycbxx8sqKrRXqIMWVmzKGGzNMe2xOFAVnCVFnHDGwKWttKEFV9B40l1O4kH3-ofUaIZtN1A/exec?action=list")
    .then(r => r.json())
    .then(renderTable)
    .catch(() => {});
}

function renderTable(data) {
  const tbody = document.getElementById("picklistTable");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML =
      `<tr><td colspan="5">No pick lists found</td></tr>`;
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
      </tr>
    `;
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
  fetch(`https://script.google.com/macros/s/AKfycbxx8sqKrRXqIMWVmzKGGzNMe2xOFAVnCVFnHDGwKWttKEFV9B40l1O4kH3-ofUaIZtN1A/exec?action=delete&pickListId=${id}&user=Supervisor`)
    .then(() => loadPickLists());
}

function forceClose(id) {
  const reason = prompt("Reason for closing pick list:");
  if (!reason) return;

  fetch(
    `https://script.google.com/macros/s/AKfycbxx8sqKrRXqIMWVmzKGGzNMe2xOFAVnCVFnHDGwKWttKEFV9B40l1O4kH3-ofUaIZtN1A/exec?action=forceClose&pickListId=${id}&user=Supervisor&reason=${encodeURIComponent(reason)}`
  )
    .then(() => loadPickLists());
}
