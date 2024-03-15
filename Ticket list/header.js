document.addEventListener("DOMContentLoaded", function () {
    const ticketList = document.getElementById("ticketList");
    const ticketModal = document.getElementById("ticketModal");
    const ticketForm = document.getElementById("ticketForm");
    const addTicketButton = document.getElementById("addTicketButton");
    const filterButton = document.getElementById("filterButton");
    const searchBar = document.getElementById("searchBar");
    const closeSearch = document.getElementById("closeSearch");
    let editingTicketIndex = -1;

    let adminDataLoaded = false;
    let userDataLoaded = false;

    function loadTicketsFromLocalStorage() {
        const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        tickets.forEach((ticketData, index) => {
            addTicketToTable(ticketData, index);
        });
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function addTicketToTable(ticketData, index) {
        const ticketRow = document.createElement("tr");
        const ticketNumber = String(index + 1).padStart(2, '0');
        let priorityBadgeClass = "";
        switch (ticketData.priority) {
            case "High":
                priorityBadgeClass = "high-priority";
                break;
            case "Medium":
                priorityBadgeClass = "medium-priority";
                break;
            case "Low":
                priorityBadgeClass = "low-priority";
                break;
        }
        let tagsAsBadges = "";
        ticketData.tags.split(',').forEach(tag => {
            let badgeClass = "";
            switch (tag.trim().toLowerCase()) {
                case "new":
                    badgeClass = "blue-badge";
                    break;
                case "replace":
                    badgeClass = "green-badge";
                    break;
                case "issue":
                    badgeClass = "red-badge";
                    break;
                case "repair":
                    badgeClass = "black-badge";
                    break;
            }
            tagsAsBadges += `<span class="badge ${badgeClass}">${tag.trim()}</span> `;
        });
        const profilePhotoInitials = (ticketData.createdByFirstName.charAt(0) + ticketData.createdByLastName.charAt(0)).toUpperCase();
        const profilePhotoBackgroundColor = getRandomColor();

        ticketRow.innerHTML = `
        <td>${ticketNumber}</td>
        <td>
            <div class="profile-photo" style="background-color: ${profilePhotoBackgroundColor};">
                ${profilePhotoInitials}
            </div>
            ${ticketData.createdByFirstName} ${ticketData.createdByLastName}
        </td> 
        <td>TN-${ticketNumber}</td>
        <td class="description-cell">
        ${tagsAsBadges} <strong>${ticketData.title}</strong><br>${ticketData.description.replace(/\n/g, '<br>')}
        </td>
        <td>${ticketData.assignee}</td>
        <td class="td"><span class="priority-badge ${priorityBadgeClass}">${ticketData.priority}</span></td>
        <td>${ticketData.status}</td>
    `;

        const editButton = document.createElement("button");
        editButton.className = "btn btn-primary edit-ticket-button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            clearTicketForm();
            const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
            const ticketData = tickets[index];

            const titleErrorElement = document.getElementById("titleError");
            if (titleErrorElement) {
                titleErrorElement.textContent = "";
            }

            if (ticketData) {   
                populateModalWithData(ticketData);
                const statusDropdown = document.getElementById("status");
                const statusName = document.getElementById("statusName");

                if (userRole === "admin") {
                    statusDropdown.style.display = "block";
                    statusName.style.display = "block";
                } else {
                    statusDropdown.style.display = "none";
                    statusName.style.display = "none";
                }
                const modalTitle = document.getElementById("modalTitle");
                modalTitle.textContent = "Edit Ticket";
                ticketModal.style.display = "block";
            }
            editingTicketIndex = index;
        });

        const editCell = document.createElement("td");
        editCell.appendChild(editButton);
        ticketRow.appendChild(editCell);

        ticketList.appendChild(ticketRow);
    }

    function populateModalWithData(ticketData) {
        document.getElementById("title").value = ticketData.title;
        document.getElementById("description").value = ticketData.description;
        document.getElementById("tags").value = ticketData.tags;
        document.getElementById("assignee").value = ticketData.assignee;
        document.getElementById("priority").value = ticketData.priority;
        document.getElementById("status").value = ticketData.status;
    }

    addTicketButton.addEventListener("click", function () {
        clearTicketForm();
        const statusDropdown = document.getElementById("status");
        statusDropdown.style.display = "none";
        const statusName = document.getElementById("statusName");
        statusName.style.display = "none";
        ticketModal.style.display = "block";
        editingTicketIndex = -1;
    });

    function clearTicketForm() {
        const ticketForm = document.getElementById("ticketForm");
        const modalTitle = document.getElementById("modalTitle");
        modalTitle.textContent = "Add Ticket";
        ticketForm.reset();
    }

    const closeButton = document.querySelector(".close");
    closeButton.addEventListener("click", function () {
        ticketModal.style.display = "none";
        editingTicketIndex = -1;
    });

    window.addEventListener("click", function (event) {
        if (event.target === ticketModal) {
            ticketModal.style.display = "none";
            editingTicketIndex = -1;
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const userRole = urlParams.get("role");

    if (userRole !== "admin" && adminDataLoaded) {
        loadTicketsFromLocalStorage();
        adminDataLoaded = true;
    }

    if (userRole !== "user" && userDataLoaded) {
        loadTicketsFromLocalStorage();
        userDataLoaded = true;
    }

    function validateTitle(title) {
        return title.trim() !== "";
    }

    const titleInput = document.getElementById("title");
    const titleErrorElement = document.getElementById("titleError");

    titleInput.addEventListener("input", () => {
        titleErrorElement.textContent = "";
    });

    ticketForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(ticketForm);
        const ticketData = {};
        formData.forEach((value, key) => {
            ticketData[key] = value;
        });

        if (!validateTitle(ticketData.title)) {
            titleErrorElement.textContent = "Please enter your title.";
            return;
        }

        if (editingTicketIndex !== -1) {
            updateTicketInTableAndLocalStorage(ticketData, editingTicketIndex);
            populateModalWithData(ticketData);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const role = urlParams.get("role");
            const firstName = urlParams.get("firstName");
            const lastName = urlParams.get("lastName");
            ticketData.role = role;
            ticketData.createdByFirstName = firstName;
            ticketData.createdByLastName = lastName;
            storeTicketInLocalStorage(ticketData);
            addTicketToTable(ticketData, ticketList.children.length);
        }
        ticketModal.style.display = "none";
        editingTicketIndex = -1;
    });

    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", function () {
        document.getElementById("titleError").textContent = "";
    
        clearTicketForm();

        ticketModal.style.display = "none";
        editingTicketIndex = -1;
    });

    function updateTicketInTableAndLocalStorage(ticketData, index) {
        const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        if (index >= 0 && index < tickets.length) {
            const ticketRow = ticketList.children[index];
            const priorityBadgeClass = getPriorityBadgeClass(ticketData.priority);
            const tagsAsBadges = getTagsAsBadges(ticketData.tags);

            ticketRow.querySelector(".description-cell").innerHTML = `
            ${tagsAsBadges} <strong>${ticketData.title}</strong><br>${ticketData.description.replace(/\n/g, '<br>')}
            `;
            ticketRow.querySelector("td:nth-child(5)").textContent = ticketData.assignee;
            ticketRow.querySelector("td:nth-child(6)").innerHTML = `<span class="priority-badge ${priorityBadgeClass}">${ticketData.priority}</span>`;
            ticketRow.querySelector("td:nth-child(7)").textContent = ticketData.status;

            tickets[index].title = ticketData.title;
            tickets[index].description = ticketData.description;
            tickets[index].tags = ticketData.tags;
            tickets[index].assignee = ticketData.assignee;
            tickets[index].priority = ticketData.priority;
            tickets[index].status = ticketData.status;

            localStorage.setItem("tickets", JSON.stringify(tickets));
        }
    }

    function getPriorityBadgeClass(priority) {
        switch (priority) {
            case "High":
                return "high-priority";
            case "Medium":
                return "medium-priority";
            case "Low":
                return "low-priority";
            default:
                return "";
        }
    }

    function getTagsAsBadges(tags) {
        return tags.split(',').map(tag => {
            let badgeClass = "";
            switch (tag.trim().toLowerCase()) {
                case "new":
                    badgeClass = "blue-badge";
                    break;
                case "replace":
                    badgeClass = "green-badge";
                    break;
                case "issue":
                    badgeClass = "red-badge";
                    break;
                case "repair":
                    badgeClass = "black-badge";
                    break;
            }
            return `<span class="badge ${badgeClass}">${tag.trim()}</span>`;
        }).join(' ');
    }

    function storeTicketInLocalStorage(ticketData) {
        let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
        tickets.push(ticketData);
        localStorage.setItem("tickets", JSON.stringify(tickets));
    }

    populateAdminDropdown();

    function populateAdminDropdown() {
        const assigneeDropdown = document.getElementById("assignee");
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const adminUsers = users.filter(user => user.role === "admin");
        assigneeDropdown.innerHTML = "";
        adminUsers.forEach(adminUser => {
            const option = document.createElement("option");
            option.value = `${adminUser.firstName} ${adminUser.lastName}`;
            option.textContent = `${adminUser.firstName} ${adminUser.lastName}`;
            assigneeDropdown.appendChild(option);
        });
    }

    loadTicketsFromLocalStorage();

    // The search functionality

    function searchTable(query) {
        const nameColumnIndex = 1;
        const tickets = document.querySelectorAll("#ticketList tr");
        query = query.toLowerCase();
        let resultsFound = false;

        tickets.forEach(function (ticket) {
            const nameCell = ticket.querySelectorAll("td")[nameColumnIndex];
            const nameText = nameCell.textContent.toLowerCase();

            if (nameText.includes(query)) {
                ticket.style.display = "table-row";
                resultsFound = true;
            } else {
                ticket.style.display = "none";
            }
        });

        const noDataMessage = document.getElementById("noDataMessage");
        const noDataImage = document.getElementById("noDataImage");

        if (resultsFound) {
            noDataMessage.style.display = "none";
            noDataImage.style.display = "none";
        } else {
            noDataMessage.style.display = "block";
            noDataImage.style.display = "block";
        }
    }

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
        const query = searchInput.value;
        searchTable(query);
    });

    filterButton.addEventListener("click", function () {
        filterButton.style.display = "none";
        searchBar.style.display = "flex";
    });

    closeSearch.addEventListener("click", function () {
        searchBar.style.display = "none";
        filterButton.style.display = "block";
    });
});
function logout() {
    window.location.href = 'login.html';
}
