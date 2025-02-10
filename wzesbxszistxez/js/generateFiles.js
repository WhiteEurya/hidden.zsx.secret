const totalDocuments = 376; // 总文档数量
const randomSeed = 42; // 固定随机种子，确保结果一致

// 伪随机数生成器（基于种子）
function seededRandom(seed) {
  let value = seed;
  return function () {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// 随机生成 2016-2025 年范围内的日期
function getRandomDate(randomFunc) {
  const start = new Date("2016-01-01").getTime();
  const end = new Date("2025-12-31").getTime();
  const randomTime = Math.floor(randomFunc() * (end - start + 1)) + start;
  return new Date(randomTime);
}

// 使用 Set 来确保日期唯一
function generateUniqueDates(seed) {
  const randomFunc = seededRandom(seed); // 用固定种子生成随机数
  const uniqueDates = new Set();

  while (uniqueDates.size < totalDocuments) {
    const randomDate = getRandomDate(randomFunc);

    // 格式化日期为字符串
    const year = String(randomDate.getFullYear()); // 完整年份
    const shortYear = year.slice(-2); // 年的后两位
    const month = String(randomDate.getMonth() + 1).padStart(2, "0");
    const day = String(randomDate.getDate()).padStart(2, "0");
    const formattedDate = `${shortYear}${month}${day}`; // 用于文档名的日期格式
    const displayDate = `${year}年${month}月${day}日`; // 用于显示的日期格式

    uniqueDates.add({ formattedDate, displayDate }); // 添加到 Set 中，确保唯一
  }

  return Array.from(uniqueDates);
}

// 打乱数组顺序（使用固定种子）
function shuffleArray(array, seed) {
  const randomFunc = seededRandom(seed); // 用固定种子生成随机数
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(randomFunc() * (i + 1)); // 随机数用于交换
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 生成文档数据
function generateDocuments() {
  const uniqueDates = generateUniqueDates(randomSeed); // 固定种子生成唯一日期
  const shuffledDates = shuffleArray(uniqueDates, randomSeed); // 固定种子打乱顺序

  // 构造文档数据
  return shuffledDates.map((dateObj, index) => ({
    title: `DG-${dateObj.formattedDate}`, // 文档标题，例如 DG-221207
    date: `上传日期: ${dateObj.displayDate}`, // 显示的中文日期，例如 2022年12月7日
    type: index % 2 === 0 ? "invalid" : "valid", // 随机设置无权限或有权限（固定规则）
  }));
}

// 初始化文档列表
const documents = generateDocuments();

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
        window.location.href = "logs/" + doc.title + ".html";
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