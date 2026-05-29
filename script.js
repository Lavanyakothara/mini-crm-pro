let leads = JSON.parse(localStorage.getItem("leads")) || [];

displayLeads();

function addLead() {

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let source = document.getElementById("source").value.trim();
    let followup = document.getElementById("followup").value;
    let priority = document.getElementById("priority").value;
    let status = document.getElementById("status").value;

    if (name === "" || email === "") {
        alert("Please enter Name and Email");
        return;
    }

    leads.push({
        name,
        email,
        source,
        followup,
        priority,
        status
    });

    localStorage.setItem("leads", JSON.stringify(leads));

    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("source").value = "";
    document.getElementById("followup").value = "";

    displayLeads();
}

function displayLeads() {

    document.getElementById("totalLeads").innerText = leads.length;

    document.getElementById("newLeads").innerText =
        leads.filter(lead => lead.status === "New").length;

    document.getElementById("contactedLeads").innerText =
        leads.filter(lead => lead.status === "Contacted").length;

    document.getElementById("convertedLeads").innerText =
        leads.filter(lead => lead.status === "Converted").length;

    let table = document.getElementById("leadTable");

    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Source</th>
            <th>Priority</th>
            <th>Follow Up</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    `;

    if (leads.length === 0) {
        table.innerHTML += `
        <tr>
            <td colspan="7">No leads found</td>
        </tr>
        `;
        return;
    }

    leads.forEach((lead, index) => {

        table.innerHTML += `
        <tr>
            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.source}</td>
            <td>${lead.priority}</td>
            <td>${lead.followup}</td>
            <td>${lead.status}</td>

            <td>
                <button class="edit-btn"
                onclick="editLead(${index})">
                Edit
                </button>

                <button class="delete-btn"
                onclick="deleteLead(${index})">
                Delete
                </button>
            </td>
        </tr>
        `;
    });
}

function editLead(index) {

    let newStatus = prompt(
        "Enter Status (New / Contacted / Converted)",
        leads[index].status
    );

    if (newStatus) {

        leads[index].status = newStatus;

        localStorage.setItem(
            "leads",
            JSON.stringify(leads)
        );

        displayLeads();
    }
}

function deleteLead(index) {

    if (confirm("Delete this lead?")) {

        leads.splice(index, 1);

        localStorage.setItem(
            "leads",
            JSON.stringify(leads)
        );

        displayLeads();
    }
}

function searchLead() {

    let input =
        document.getElementById("search")
        .value
        .toLowerCase();

    let rows =
        document.querySelectorAll("#leadTable tr");

    for (let i = 1; i < rows.length; i++) {

        let text =
            rows[i].innerText.toLowerCase();

        rows[i].style.display =
            text.includes(input)
                ? ""
                : "none";
    }
}

function exportCSV() {

    let csv =
        "Name,Email,Source,Priority,FollowUp,Status\n";

    leads.forEach(lead => {

        csv +=
            `${lead.name},${lead.email},${lead.source},${lead.priority},${lead.followup},${lead.status}\n`;

    });

    let blob =
        new Blob([csv], {
            type: "text/csv"
        });

    let link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "leads.csv";

    link.click();
}