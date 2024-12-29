const sections = document.querySelectorAll('.section'); // 获取所有的全屏页面
const navbar = document.getElementById('navbar'); // 获取导航栏
const scrollDownButton = document.querySelector('.scroll-down');
let currentSectionIndex = 0; // 当前页面索引
let isScrolling = false; // 防止滚动事件被多次触发

// 滚动切换页面
window.addEventListener('wheel', (event) => {
    if (isScrolling) return; // 防止频繁触发滚动
    isScrolling = true;

    // 判断滚动方向
    if (event.deltaY > 0 && currentSectionIndex < sections.length - 1) {
    currentSectionIndex++; // 向下滚动
    } else if (event.deltaY < 0 && currentSectionIndex > 0) {
    currentSectionIndex--; // 向上滚动
    }

    // 滚动到目标页面
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });

    // 延迟解除滚动锁定
    setTimeout(() => {
    isScrolling = false;
    }, 1000);
});

// 点击 Scroll Down 按钮滚动到第二屏
scrollDownButton.addEventListener('click', () => {
    currentSectionIndex = 1;
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
});

// 点击导航栏的 Home 和 About 链接
document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    currentSectionIndex = 0;
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('about-link').addEventListener('click', (e) => {
    e.preventDefault();
    currentSectionIndex = 1;
    sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
});