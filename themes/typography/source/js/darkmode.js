/**
 * @Author: kaho
 * @Date: 2021-07-03 09:46:00
 * @Mail: kahosan@outlook.com
 * @LastEditTime: 2023-10-24
 */

const getModeFromSystem = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const key = 'theme';

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

(function(){
  const theme = getLS(key)
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (getModeFromSystem === 'dark') {
    document.documentElement.classList.add('dark');
  };
})()

const modeChange = () => {
  const currentMode = getLS(key) || getModeFromSystem();
  const targetMode = currentMode === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.remove(currentMode);
  document.documentElement.classList.add(targetMode);
  setLS(key, targetMode);
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (e.matches && !getLS(key)) {
    document.documentElement.classList.add('dark');
  } else if (!e.matches && !getLS(key)) {
    document.documentElement.classList.remove('dark');
  }
});
