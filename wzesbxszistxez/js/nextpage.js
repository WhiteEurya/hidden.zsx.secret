// 页面加载时的淡入效果
window.addEventListener("load", () => {
  const cover = document.getElementById("transition-cover");

  // 1. 淡出遮罩层
  if (cover) {
    cover.classList.add("hidden"); // 添加类触发遮罩淡出
    setTimeout(() => {
      cover.style.display = "none"; // 动画完成后移除遮罩层
    }, 500); // 确保动画持续时间一致
  }

  // 2. 页面内容淡入
  gsap.to("body", {
    duration: 0.5, // 页面淡入动画时间
    opacity: 1, // 页面从透明到完全不透明
    ease: "power2.inOut",
  });
});

// 页面跳转时的淡出效果（带遮罩层）
function navigateTo(url) {
  const cover = document.getElementById("transition-cover");

  if (cover) {
    cover.style.display = "block"; // 显示遮罩层
    cover.classList.remove("hidden"); // 确保遮罩层可见

    // 1. 遮罩淡入
    gsap.to(cover, {
      duration: 0.5,
      opacity: 1, // 遮罩逐渐变得不透明
      ease: "power2.inOut",
      onComplete: () => {
        // 2. 跳转到目标页面
        window.location.href = url;
      },
    });

    // 3. 页面内容淡出（可选）
    gsap.to("body", {
      duration: 1, 
      opacity: 0, // 页面内容逐渐透明
      ease: "power2.inOut",
    });
  }
}

// 为导航按钮绑定点击事件
const nextPage = document.getElementById("next-page");
if (nextPage) {
  nextPage.addEventListener("click", () => navigateTo("dxa1taa3svect1.html"));
}

const HomePage = document.getElementById("goHome");
if (HomePage) {
  HomePage.addEventListener("click", () => navigateTo("saeca3r1cxh8bdo2x1.html"));
}

const AboutPage = document.getElementById("goAbout");
if (AboutPage) {
  AboutPage.addEventListener("click", () => navigateTo("saeca3r1cxh8bdo2x1.html#about"));
}