((darkModeChange) => {
    $('#darkmode').click(() => {
        const darkStyle = "/css/style-dark.css";
        var nowThemeMode = true;

        if (document.getElementById('dark') == null) {
            nowThemeMode = '';
        }

        localStorage.nowThemeMode = nowThemeMode;
        if (!nowThemeMode) {
            linkTag = $('<link id="dark" href="' + darkStyle + '" rel="stylesheet" type="text/css" />');
            $($('head')[0]).append(linkTag);
            nowThemeMode = true;
        } else {
            $('#dark').remove();
        }
    });
})();