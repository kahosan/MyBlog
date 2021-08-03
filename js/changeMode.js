const darkStyle = "/css/style-dark.css";
var nowThemeMode;

nowThemeMode = localStorage.nowThemeMode;
if (!nowThemeMode) {
    linkTag = document.createElement('link');

    linkTag.id = 'dark';
    linkTag.href = darkStyle;
    linkTag.setAttribute('rel', 'stylesheet');

    document.head.appendChild(linkTag);
}