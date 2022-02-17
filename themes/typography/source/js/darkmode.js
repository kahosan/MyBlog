/**
 * @Author: kaho
 * @Date: 2021-07-03 09:46:00
 * @Mail: kahosan@outlook.com
 * @LastEditTime: 2022-02-17
 */

const darkStyle = '/css/style-dark.css';
const darkModeToggleBottonElement = document.getElementById('darkmode');
const getModeFromSystem = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const getDarkCssElement = () => document.querySelector('link[id="dark"]');

// 来源 Sukka
const setLS = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
};

const removeLS = key => {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
};

const getLS = key => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null; // 与 localStorage 中没有找到对应 key 的行为一致
  }
};

const inverMode = {
  dark: 'light',
  light: 'dark',
};

const addDarkMode = () => {
  getDarkCssElement().disabled = '';
};

// 删除夜间模式
const deleteDarkMode = () => {
  getDarkCssElement().disabled = 'true';
};

const validColorModeKeys = {
  dark: true,
  light: false,
};

const modeChange = () => {
  let currentMode = getLS('nowMode');

  if (validColorModeKeys[currentMode] === undefined) {
    currentMode = getModeFromSystem();
  }

  if (validColorModeKeys[currentMode]) {
    deleteDarkMode();
    setLS('nowMode', 'light');
  } else {
    addDarkMode();
    setLS('nowMode', 'dark');
  }
};

(() => {
  if (getLS('nowMode') === null || getLS('nowMode') === 'system') {
    const mode = getModeFromSystem();

    if (validColorModeKeys[mode]) {
      // 设置为该模式
      addDarkMode();
    } else {
      deleteDarkMode();
    }
  }

  if (getLS('nowMode') === 'dark') {
    addDarkMode();
  }
})();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (e.matches) {
    addDarkMode();
    setLS('nowMode', 'system');
  } else {
    deleteDarkMode();
    setLS('nowMode', 'system');
  }
});
