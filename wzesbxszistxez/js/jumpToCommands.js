const inputField = document.getElementById("record-input");
const searchButton = document.getElementById("search-button");

// 添加按钮点击事件
searchButton.addEventListener("click", () => {
const inputValue = inputField.value.trim(); // 获取输入框的值并去掉多余空格
if (inputValue.toLowerCase() === "commands") {
    // 如果输入为 "commands"，跳转到新页面
    window.location.href = "../innercommand/command.html"; // 替换为目标页面的 URL
} else {
    // 其他逻辑，例如显示错误提示或执行搜索
    alert("未找到记录，请检查输入编号！");
}
});