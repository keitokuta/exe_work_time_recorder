// 作業記録を保存する配列（ローカルストレージから読み込み）
let workRecords = JSON.parse(localStorage.getItem("workRecords")) || [];
let startTime = null;

// ページ読み込み時に既存の記録を表示
document.addEventListener("DOMContentLoaded", function () {
    displayWorkTimeList();
    updateButtonStates();
});

// 作業開始ボタンがクリックされたときの処理
document.getElementById("start-btn").addEventListener("click", function () {
    if (startTime === null) {
        startTime = new Date();
        updateButtonStates();
        showMessage("作業を開始しました！", "success");
    }
});

// 作業停止ボタンがクリックされたときの処理
document.getElementById("stop-btn").addEventListener("click", function () {
    if (startTime !== null) {
        const stopTime = new Date();

        // 作業記録を作成
        const workRecord = {
            date: formatDate(startTime),
            startTime: formatTime(startTime),
            endTime: formatTime(stopTime),
            duration: calculateDuration(startTime, stopTime),
        };

        // 記録を配列に追加
        workRecords.push(workRecord);

        // ローカルストレージに保存
        localStorage.setItem("workRecords", JSON.stringify(workRecords));

        // 一覧を更新
        displayWorkTimeList();

        // 状態をリセット
        startTime = null;
        updateButtonStates();

        showMessage(`作業を停止しました！（作業時間: ${workRecord.duration}）`, "success");
    }
});

// ボタンの状態を更新する関数
function updateButtonStates() {
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");

    if (startTime === null) {
        // 作業していない状態
        startBtn.disabled = false;
        stopBtn.disabled = true;
        startBtn.textContent = "開始";
    } else {
        // 作業中の状態
        startBtn.disabled = true;
        stopBtn.disabled = false;
        startBtn.textContent = "作業中...";
    }
}

// 日付をフォーマットする関数（YYYY/MM/DD形式）
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
}

// 時間をフォーマットする関数（HH:MM形式）
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}

// 作業時間を計算する関数
function calculateDuration(start, end) {
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;

    if (hours > 0) {
        return `${hours}時間${minutes}分`;
    } else {
        return `${minutes}分`;
    }
}

// 作業時間一覧を表示する関数
function displayWorkTimeList() {
    const tbody = document.getElementById("workTimeList");
    tbody.innerHTML = "";

    if (workRecords.length === 0) {
        // 記録がない場合のメッセージ
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="3" style="color: #7f8c8d; font-style: italic;">
                まだ作業記録がありません
            </td>
        `;
        tbody.appendChild(row);
        return;
    }

    // 記録を新しい順に表示（最新が上に来るように）
    const sortedRecords = [...workRecords].reverse();

    sortedRecords.forEach(function (record) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.startTime}</td>
            <td>${record.endTime}</td>
        `;
        tbody.appendChild(row);
    });
}

// メッセージを表示する関数
function showMessage(message, type = "info") {
    // 既存のメッセージがあれば削除
    const existingMessage = document.querySelector(".message");
    if (existingMessage) {
        existingMessage.remove();
    }

    // メッセージ要素を作成
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    // スタイルを設定
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;

    // タイプに応じて背景色を設定
    if (type === "success") {
        messageDiv.style.backgroundColor = "#27ae60";
    } else if (type === "error") {
        messageDiv.style.backgroundColor = "#e74c3c";
    } else {
        messageDiv.style.backgroundColor = "#3498db";
    }

    // ページに追加
    document.body.appendChild(messageDiv);

    // 3秒後に自動で削除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = "slideOut 0.3s ease-in";
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 3000);
}

// アニメーション用のCSSを動的に追加
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
