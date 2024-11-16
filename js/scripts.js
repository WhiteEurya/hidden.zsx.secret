// 获取所有悬浮窗
const floatWindows = document.querySelectorAll('.float-window');

// 获取所有关闭按钮
const closeButtons = document.querySelectorAll('.close');

// 添加点击事件，打开对应的模态框
floatWindows.forEach(window => {
    window.addEventListener('click', () => {
        const modalId = window.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
        }
    });
});

// 添加点击事件，关闭模态框
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
});

// 点击模态框外部，关闭弹出的模态框
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// 密码验证功能
function validatePassword(event) {
    event.preventDefault();
    var password = document.getElementById('password').value;
    var errorMsg = document.getElementById('error-msg');
    var correctPassword = "zsx4b7y9"; // 设置您的秘密密码

    if (password === correctPassword) {
        // 密码正确，跳转到成功页面
        window.location.href = "success.html";
    } else {
        // 密码错误，显示错误信息
        errorMsg.style.display = 'block';
    }
}