document.addEventListener("DOMContentLoaded", function () {
    const ticketList = document.getElementById("ticketList");

    // Load and populate the table with existing ticket data from local storage
    function loadTicketsFromLocalStorage() {
        const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

        // Loop through the stored tickets and add them to the table
        tickets.forEach((ticketData, index) => {
            addTicketToTable(ticketData);
        });
    }

    // Function to generate a random background color
    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to add a new ticket to the table
    function addTicketToTable(ticketData) {
        const ticketRow = document.createElement("tr");

        // Generate a zero-padded ticket number
        const ticketNumber = String(ticketList.children.length + 1).padStart(2, '0');

        // Determine the priority badge class based on ticketData.priority
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
            default:
                break;
        }

        // Convert tags to badges with different colors
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
                default:
                    break;
            }
            tagsAsBadges += `<span class="badge ${badgeClass}">${tag.trim()}</span> `;
        });

        // Get the first letter of the first name and last name
        const profilePhotoInitials = (ticketData.createdByFirstName.charAt(0) + ticketData.createdByLastName.charAt(0)).toUpperCase();

        // Generate a random background color for the profile photo
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
        <td><img src="watch.png" alt="" class="watch">Pending</td>    
        <td><button class="btn btn-primary">Edit</button></td>
    `;

        ticketList.appendChild(ticketRow);
    }
    // Call the function to load and populate the table
    loadTicketsFromLocalStorage();
});