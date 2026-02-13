window.onload = function() {
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-feedback');
    const suggestionBox = document.getElementById('user-suggestion');
    const thanksMsg = document.getElementById('thank-you-msg');
    const inputArea = document.getElementById('input-area');
    const grid = document.getElementById('experience-grid');

    let selectedRating = 0;

    // 1. STAR SELECTION
    stars.forEach(star => {
        star.onclick = function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            // Remove active class from all stars, then add to the clicked one
            stars.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
        };
    });

    // 2. FEEDBACK SUBMISSION
    if (submitBtn) {
        submitBtn.onclick = function() {
            if (selectedRating === 0) {
                alert("Please select a star rating!");
                return;
            }

            const feedbackText = suggestionBox.value.trim();
            const logEntry = {
                rating: selectedRating,
                text: feedbackText,
                date: new Date().toLocaleString()
            };

            // --- DEBUG LINE: This shows you the data in the Inspect Console ---
            console.log("Feedback Saved to LocalStorage:", logEntry);

            // Save for Admin
            let allLogs = JSON.parse(localStorage.getItem('transportFeedback')) || [];
            allLogs.push(logEntry);
            localStorage.setItem('transportFeedback', JSON.stringify(allLogs));

            // Update UI Card
            const card = document.createElement('div');
            card.className = 'exp-card';
            card.innerHTML = `
                <div style="color:#7b74bc">${'★'.repeat(selectedRating)}</div>
                <p>"${feedbackText || 'Excellent journey'}"</p>
                <span style="font-size:11px; opacity:0.6">- Just now</span>
            `;
            
            if (grid) {
                grid.prepend(card);
            }

            // Hide form and show thanks message
            if (inputArea) inputArea.style.display = "none";
            if (thanksMsg) {
                thanksMsg.style.display = "block";
                thanksMsg.classList.remove('hidden');
            }
        };
    }
};