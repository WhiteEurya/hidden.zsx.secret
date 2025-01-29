const inputField = document.getElementById("record-input");
const searchButton = document.getElementById("search-button");

// 添加按钮点击事件
searchButton.addEventListener("click", () => {
const inputValue = inputField.value.trim(); // 获取输入框的值并去掉多余空格
if (inputValue.toLowerCase() === "commands") {
    // 如果输入为 "commands"，跳转到新页面
    window.location.href = "../innercommand/command.html"; // 替换为目标页面的 URL
} else {
    // 构造目标页面的 URL
    const targetUrl = "logs/" + inputValue + ".html";

    // 使用 fetch 检查页面是否存在
    fetch(targetUrl, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                // 如果页面存在，则跳转
                window.location.href = targetUrl;
            } else {
                // 如果页面不存在，显示错误提示
                alert("未找到记录，请检查输入编号！");
            }
        })
        .catch(error => {
            // 如果请求出错，也显示错误提示
            console.error('Error:', error);
            alert("请求出错，请稍后再试！");
        });
}
});