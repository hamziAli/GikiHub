window.onload = function() {
    const adminPassword = "20060419"; 
    const userAttempt = prompt("Enter Admin Password:");

    if (userAttempt === adminPassword) {
        loadAdminQueue();  // Load requests waiting for approval
        loadLiveManager(); // Load events already on the site
    } else {
        alert("Access Denied!");
        window.location.href = "social-event.html";
    }
};

// --- PENDING QUEUE (For New Requests) ---
function loadAdminQueue() {
    const adminList = document.getElementById('admin-list');
    adminList.innerHTML = '<h2 style="grid-column: 1/-1; color:#7b74bc; margin-bottom:20px;">Pending Approvals</h2>';
    let pending = JSON.parse(localStorage.getItem('pendingEvents')) || [];

    if (pending.length === 0) {
        adminList.innerHTML += `<p style="grid-column: 1/-1; text-align:center; opacity:0.5;">No pending requests.</p>`;
    }

    pending.forEach((event, index) => {
        const card = document.createElement('div');
        card.className = 'exp-card';
        card.innerHTML = `
            ${event.image ? `<img src="${event.image}" style="width:100%; max-height:120px; object-fit:cover; border-radius:5px; margin-bottom:10px;">` : ''}
            <h4 style="margin:0;">${event.title}</h4>
            <p style="font-size:11px; opacity:0.7;">Section: ${event.category}</p>
            <div style="display:flex; gap:10px; margin-top:10px;">
                <button onclick="processEvent(${index}, 'approve')" class="buy-now-btn" style="flex:1; padding:8px;">Approve</button>
                <button onclick="processEvent(${index}, 'reject')" class="buy-now-btn" style="background:#cc3333; flex:1; padding:8px;">Reject</button>
            </div>
        `;
        adminList.appendChild(card);
    });
}

// --- LIVE MANAGER (To Delete Single Events) ---
function loadLiveManager() {
    const adminList = document.getElementById('admin-list');
    const liveSection = document.createElement('div');
    liveSection.style = "grid-column: 1/-1; margin-top: 50px; border-top: 1px solid #444; padding-top: 30px;";
    liveSection.innerHTML = '<h2 style="color:#4CAF50; margin-bottom:20px;">Live Site Manager (Single Delete)</h2>';

    let approved = JSON.parse(localStorage.getItem('approvedEvents')) || [];
    
    approved.forEach((event, index) => {
        const row = document.createElement('div');
        row.style = "display:flex; justify-content:space-between; align-items:center; background:#1a1a1a; padding:15px; margin-bottom:10px; border-radius:8px; border-left: 4px solid #4CAF50;";
        row.innerHTML = `
            <span><strong>${event.title}</strong> <small style="opacity:0.6; margin-left:10px;">[${event.category}]</small></span>
            <button onclick="deleteSingle(${index})" style="background:#ff4444; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer;">Delete 🗑️</button>
        `;
        liveSection.appendChild(row);
    });
    adminList.appendChild(liveSection);
}

function deleteSingle(index) {
    if(confirm("Permanently delete this specific event from the live site?")) {
        let approved = JSON.parse(localStorage.getItem('approvedEvents')) || [];
        approved.splice(index, 1);
        localStorage.setItem('approvedEvents', JSON.stringify(approved));
        location.reload(); // Refresh to update view
    }
}

function processEvent(index, action) {
    let pending = JSON.parse(localStorage.getItem('pendingEvents'));
    if (action === 'approve') {
        let approved = JSON.parse(localStorage.getItem('approvedEvents')) || [];
        approved.push(pending[index]);
        localStorage.setItem('approvedEvents', JSON.stringify(approved));
    }
    // Remove from pending in both cases
    pending.splice(index, 1);
    localStorage.setItem('pendingEvents', JSON.stringify(pending));
    location.reload();
}