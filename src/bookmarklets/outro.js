    }
    function getXrmWin() {
        return Array.prototype.slice.call(document.querySelectorAll('iframe')).filter(function(d) {
            return d.style.visibility !== 'hidden';
        })[0].contentWindow;
    }
    function getXrm() { return getXrmWin().Xrm; }
    bookmarklet(window, getXrmWin(), getXrm());
})();