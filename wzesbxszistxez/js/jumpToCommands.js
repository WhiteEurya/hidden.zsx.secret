const inputField = document.getElementById("record-input");
const searchButton = document.getElementById("search-button");

// 添加按钮点击事件
searchButton.addEventListener("click", async () => {
  const inputValue = inputField.value.trim(); // 获取输入框的值并去掉多余空格

  // 调用 Vercel API 检查输入内容
  try {
    const response = await fetch("/api/check-commands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: inputValue }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.redirect) {
        // 如果需要跳转，重定向到指定页面
        window.location.href = data.url;
      } else if (data.message) {
        // 如果有提示信息，显示提示
        alert(data.message);
      }
    } else {
      // 如果 API 返回错误状态码，显示提示
      alert("请求出错，请稍后再试！");
    }
  } catch (error) {
    // 捕获网络或其他错误
    console.error("Error:", error);
    alert("网络出错，请稍后再试！");
  }
});