const documents = [];

// 生成文档列表
const startDate = new Date("2024-01-01");
const totalDocuments = 366; // 总文档数量

for (let i = totalDocuments; i > 0; i--) {
  const currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + i);

  // 格式化日期为 Exp#240102 格式
  const year = String(currentDate.getFullYear()).slice(-2);
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}${month}${day}`;

  documents.push({
    title: `Exp-${formattedDate}`, // 文档标题
    date: `上传日期: 20${year}-${month}-${day}`, // 文档的显示日期
    type: i % 183 === 0 ? "valid" : "invalid", // 每 5 个文档设置为无权限
  });
}
const documentList = document.getElementById("document-list");
const pagination = document.getElementById("pagination");
const alertBox = document.getElementById("alert-box");

// 分页变量
const itemsPerPage = 12; // 每页显示的文档数量
let currentPage = 1;

// 全局计时器 ID
let timeoutId = null;

// 渲染文档列表
function renderDocuments(page = 1) {
  documentList.innerHTML = ""; // 清空列表
  const startIndex = (page - 1) * itemsPerPage; // 当前页的起始索引
  const endIndex = Math.min(startIndex + itemsPerPage, documents.length); // 当前页的结束索引

  const currentDocs = documents.slice(startIndex, endIndex); // 获取当前页的文档

  currentDocs.forEach((doc) => {
    const div = document.createElement("div");
    div.className = "document";
    div.setAttribute("data-type", doc.type);
    div.innerHTML = `
      <div class="document-title">${doc.title}</div>
      <div class="document-date">${doc.date}</div>
    `;
    // 点击事件
    div.addEventListener("click", () => {
      if (doc.type === "invalid") {
        // 显示权限不足提示框
        alertBox.classList.remove("hide");
        alertBox.classList.add("show");
        alertBox.style.display = "block";

        // 清除之前的计时器
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // 设置新的计时器
        timeoutId = setTimeout(() => {
          alertBox.classList.remove("show");
          alertBox.classList.add("hide");

          // 等待淡出动画完成后隐藏提示框
          setTimeout(() => {
            alertBox.style.display = "none";
          }, 500); // 与 CSS 中的 transition 时间一致
        }, 2000); // 延迟 2 秒后淡出
      } else {
        window.location.href = "logs/"+doc.title+".html";
      }
    });
    documentList.appendChild(div);
  });
}

// 渲染分页按钮
function renderPagination() {
  pagination.innerHTML = ""; // 清空分页按钮
  const totalPages = Math.ceil(documents.length / itemsPerPage); // 总页数

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    if (i === currentPage) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      currentPage = i; // 更新当前页码
      renderDocuments(currentPage); // 渲染当前页的文档
      renderPagination(); // 更新分页按钮
    });
    pagination.appendChild(button);
  }
}

// 动态生成的文字内容
const hiddenContent = "快跑！";

// 遮罩加载时插入内容
function addHiddenText() {
  const coverElement = document.getElementById("transition-cover");
  const textElement = document.createElement("p");
  textElement.textContent = hiddenContent;
  textElement.style.color = "red"; // 文字颜色
  textElement.style.fontSize = "20px";
  textElement.style.justifyContent = "center";
  coverElement.appendChild(textElement);
}

// 调用显示文字的函数
addHiddenText();

// 初始化页面
renderDocuments();
renderPagination();