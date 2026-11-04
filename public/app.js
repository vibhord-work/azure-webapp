const table = document.getElementById("patientsTable");
const count = document.getElementById("patientCount");
const status = document.getElementById("connectionStatus");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

async function loadPatients() {
  refreshBtn.disabled = true;
  status.textContent = "Connecting...";
  message.textContent = "Loading patient records...";
  table.replaceChildren();

  try {
    const response = await fetch("/api/patients", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data.patients)) {
      throw new Error("Unexpected API response");
    }

    count.textContent = data.patients.length;
    status.textContent = "Connected";
    message.textContent = data.patients.length
      ? ""
      : "No patient records found.";

    for (const patient of data.patients) {
      const row = document.createElement("tr");

      for (const value of [
        patient.PatientId,
        patient.FullName,
        patient.Department
      ]) {
        const cell = document.createElement("td");
        cell.textContent = value ?? "";
        row.appendChild(cell);
      }

      table.appendChild(row);
    }
  } catch (error) {
    count.textContent = "—";
    status.textContent = "Disconnected";
    message.textContent = `Unable to load patients: ${error.message}`;
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener("click", loadPatients);
loadPatients();
