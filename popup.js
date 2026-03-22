document.addEventListener("DOMContentLoaded", function() {
    
    const style = document.createElement('style');
    style.innerHTML = `
        #bb-toast-container {
            position: fixed; top: 20px; right: 20px; z-index: 9999;
            display: flex; flex-direction: column; gap: 10px;
        }
        .bb-toast {
            background-color: white; border-left: 5px solid #FF5100;
            box-shadow: 0px 5px 15px rgba(0,0,0,0.2); border-radius: 8px;
            padding: 15px 20px; display: flex; align-items: center; gap: 15px;
            font-family: 'BenchNine', sans-serif; font-size: 1.5rem; color: black;
            animation: slideIn 0.3s ease forwards;
        }
        .bb-toast img { height: 30px; width: auto; }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        
        #bb-confirm-modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 10000;
        }
        .bb-confirm-box {
            background: white; padding: 30px; border-radius: 15px; text-align: center;
            font-family: 'Passion One', sans-serif; font-size: 2.2rem;
            box-shadow: 0px 10px 30px rgba(0,0,0,0.3);
        }
        .bb-confirm-btns { margin-top: 20px; display: flex; gap: 15px; justify-content: center; }
        .bb-confirm-btns button {
            padding: 10px 25px; border: none; border-radius: 5px; font-family: 'Passion One', sans-serif;
            font-size: 1.6rem; cursor: pointer; color: white; transition: transform 0.2s ease;
        }
        .bb-confirm-btns button:hover { transform: translateY(-3px); }
        .bb-btn-yes { background-color: #889E0C; }
        .bb-btn-no { background-color: #FF5100; }
    `;
    document.head.appendChild(style);

    const toastContainer = document.createElement('div');
    toastContainer.id = 'bb-toast-container';
    document.body.appendChild(toastContainer);

    window.alert = function(message) {
        const toast = document.createElement('div');
        toast.className = 'bb-toast';
        toast.innerHTML = '<img src="images/mainlogo.png"><span>' + message + '</span>';
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    const modal = document.createElement('div');
    modal.id = 'bb-confirm-modal';
    modal.innerHTML = `
        <div class="bb-confirm-box">
            <p id="bb-confirm-text"></p>
            <div class="bb-confirm-btns">
                <button class="bb-btn-yes" id="bb-yes">YES</button>
                <button class="bb-btn-no" id="bb-no">CANCEL</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    window.customConfirm = function(message, onConfirm) {
        document.getElementById('bb-confirm-text').innerText = message;
        modal.style.display = 'flex';
        
        document.getElementById('bb-yes').onclick = function() {
            modal.style.display = 'none';
            onConfirm();
        };
        
        document.getElementById('bb-no').onclick = function() {
            modal.style.display = 'none';
        };
    };

    const pendingMsg = sessionStorage.getItem('bb_pending_toast');
    if (pendingMsg) {
        window.alert(pendingMsg);
        sessionStorage.removeItem('bb_pending_toast');
    }
});