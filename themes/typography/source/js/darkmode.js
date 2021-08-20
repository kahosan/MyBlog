/**
 * @Author: kaho
 * @Date: 2021-07-03 09:46:00
 * @Mail: kahosan@outlook.com
 * @LastEditTime: 2021-08-10 00:23:51
 */

// 获取当前操作系统的主题模式
const nowMode = "nowMode";
const darkStyle = "/css/style-dark.css";
const darkModeToggleBottonElement = document.getElementById("darkmode");
const getModeFromSystem = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
const getDarkStyleIsExist = () => document.getElementById("dark");

// 封装下 LocalStorage 的操作，以应对 HTML5 Storage 被禁用、localStorage 被写满、localStorage 实现不完整的情况
// 来源 Sukka
const setLS = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
};

const removeLS = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
};

const getLS = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null // 与 localStorage 中没有找到对应 key 的行为一致
  }
};

//反转样式
const inverMode = {
  dark: "light",
  light: "dark"
}


const validColorModeKeys = {
  dark: true,
  light: true
};

// 加入夜间模式
const addDarkMode = () => {
  linkTag = document.createElement('link');

  linkTag.id = 'dark';
  linkTag.href = darkStyle;
  linkTag.setAttribute('rel', 'stylesheet');

  document.head.appendChild(linkTag);
}

// 删除夜间模式
const deleteDarkMode = () => {
  getDarkStyleIsExist().remove();
}


//应用夜间模式
const applyCustomdDarkMode = mode => {
  const currentMode = mode || getLS(nowMode);
  
  if (currentMode === "light" && !getDarkStyleIsExist()) {
    addDarkMode();
  } else if (currentMode === "dark" && getDarkStyleIsExist()) {
    deleteDarkMode();
  }
}

//获取转换后的当前模式
const toggleMode = () => {
  let currentMode = getLS(nowMode);

  if (validColorModeKeys[currentMode]) {
    currentMode = inverMode[currentMode];
  } else if (currentMode === null) {
    currentMode = inverMode[getModeFromSystem()];
  } else {
    return;
  }

  setLS(nowMode, currentMode);

  return currentMode;
}

applyCustomdDarkMode();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  if (event.matches) {
    if (getDarkStyleIsExist()) {
      return;
    } else {
      addDarkMode();
      setLS(nowMode, "light");
    }
  } else {
    if (!getDarkStyleIsExist()) {
      return;
    } else {
      deleteDarkMode();
      setLS(nowMode, "dark");
    }

  }
});