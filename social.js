window.onload = function() {
    const submitBtn = document.getElementById('submit-event');
    const approvedEvents = JSON.parse(localStorage.getItem('approvedEvents')) || [];
    
    // 1. RENDER APPROVED EVENTS INTO THEIR GRIDS
    approvedEvents.forEach(event => {
        const grid = document.getElementById(event.category);
        if (grid) {
            const card = document.createElement('div');
            card.className = 'exp-card'; 
            card.innerHTML = `
                ${event.image ? `<img src="${event.image}" style="width:100%; border-radius:10px; margin-bottom:10px;">` : ''}
                <h3 style="color:#7b74bc; margin-bottom:5px;">${event.title}</h3>
                <p style="font-size: 0.9em; color: #eee; margin-bottom:12px;">${event.summary}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size:11px; opacity:0.6">By: ${event.email.split('@')[0]}</span>
                    <span style="background:rgba(123, 116, 188, 0.2); padding: 2px 8px; border-radius:4px; font-size:9px;">Verified</span>
                </div>
            `;
            grid.appendChild(card);
        }
    });

    // 2. SUBMIT EVENT LOGIC
    if (submitBtn) {
        submitBtn.onclick = function() {
            const email = document.getElementById('user-email').value;
            const pass = document.getElementById('user-pass').value;
            const fileInput = document.getElementById('event-image');

            if (!email.toLowerCase().endsWith('@giki.edu.pk') || pass.length < 4) {
                alert("Valid GIKI Email & 4-digit Password required.");
                return;
            }

            // SAFETY CHECK: Prevent browser storage from crashing (Max 1MB)
            if (fileInput.files[0] && fileInput.files[0].size > 1024 * 1024) {
                alert("Image too large! Please use a file smaller than 1MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function() {
                const pendingEntry = {
                    email,
                    title: document.getElementById('event-title').value,
                    summary: document.getElementById('event-summary').value,
                    category: document.getElementById('event-category').value,
                    image: fileInput.files[0] ? reader.result : null,
                    id: Date.now()
                };

                let pending = JSON.parse(localStorage.getItem('pendingEvents')) || [];
                pending.push(pendingEntry);
                
                try {
                    localStorage.setItem('pendingEvents', JSON.stringify(pending));
                    // UI Feedback
                    const inputArea = document.getElementById('input-area');
                    if(inputArea) inputArea.style.display = "none";
                    document.getElementById('thank-you-msg').classList.remove('hidden');
                } catch (e) {
                    alert("Storage full! Please ask Admin to delete some live events.");
                }
            };

            if (fileInput.files[0]) { 
                reader.readAsDataURL(fileInput.files[0]); 
            } else { 
                reader.onload(); 
            }
        };
    }
};