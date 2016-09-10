var XMLHttpRequestAsync = (function () {
    function XMLHttpRequestAsync() {
    }
    XMLHttpRequestAsync.send = function (xhr, data) {
        return new Promise(function (resolve, reject) {
            xhr.onload = function (e) {
                resolve(e);
            };
            xhr.onerror = function (e) {
                reject(e);
            };
            xhr.send(data);
        });
    };
    return XMLHttpRequestAsync;
})();
exports["default"] = XMLHttpRequestAsync;
