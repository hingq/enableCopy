(function () {
    'use strict';
    var path = ""
    var init = {
        stopPropagation: (event) => {
            event.stopPropagation();
        },
        stopPropagation_keydown: () => {
            window.addEventListener("keydown", e => e.ctrlKey && e.key.toLocaleUpperCase() === "C" && e.stopPropagation(), true)
        },
        stopPropagation_selectStart: () => {
            window.addEventListener('selectstart', init.stopPropagation, true);
            document.addEventListener('selectstart', init.stopPropagation, true);
            document.onselectstart = (e) => e.stopPropagation();
        },
        stopPropagation_copy: () => {
            document.addEventListener('copy', () => {
                init.stopPropagation
            }, true);
            document.oncopy = () => {
                init.stopPropagation
            }
            window.addEventListener('copy', init.stopPropagation, true);
            document.body.addEventListener('copy', (e) => init.stopPropagation);
        },
    }
    function goInit() {
        init.stopPropagation_copy()
        init.stopPropagation_keydown()
        init.stopPropagation_selectStart()
    }
    function copy(data) {
        const textarea = document.createElement("textarea");
        textarea.style.position = "fixed";
        textarea.style.left = "-999px";
        textarea.style.top = "-999px";
        textarea.value = data;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(document.body.lastElementChild);
    }
    goInit()

    const web_doc88 = {
        regexp: /.*doc88.com\/.+/,
        getContentText: () => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://res3.doc88.com/resources/js/modules/main-v2.min.js?v=2.56",
                onload: function (response) {
                    const result = /\("#cp_textarea"\).val\(([\S]*?)\);/.exec(response.responseText);
                    if (result) path = result[1];

                }
            });
            
            if (!path) {
                unsafeWindow.Config.vip = 1;
                unsafeWindow.Config.logined = 1;
            }
        }
    }

    const web_wenkubaidu={
        // "wenku.baidu.com/(view|link|aggs).*"
        regexp:/.*wenku.baidu.com\/(view|link|aggs).*/g,
        getContentText:()=>{
          document.addEventListener("mouseup",()=>{
            if (window.getSelection && (window.getSelection() || "").toString()) {
                return (window.getSelection() || "").toString();
            }
            const result = /查看全部包含“([\s\S]*?)”的文档/.exec(document.body.innerHTML);
            console.log(result);
            copy(result[1]);
          })
        }
    }
    const web_csdn={
        regexp:/.*blog.csdn.net.*/g,
        getContentText:()=>{
            const css = `*{
                user-select: auto !important;
                -webkit-user-select: auto !important;}
                `;
            const style=document.createElement('style');
            style.innerHTML=css;
            window.addEventListener("load",()=>{
                document.getElementsByTagName('head')[0].appendChild(style)
            })
            document.addEventListener("mouseup",()=>{
                console.log(document.getSelection);
            })
            
        }
    }
    const web_ruiwen={
        regexp:/.*www.ruiwen.com.*/,
        getContentText:()=>{
            let data=window.getSelection().toString()
            copy(data)
        }
    }
    const jy135={
        regexp:/.*jy135.com\/.*/,
        getContentText:()=>{
            let data=window.getSelection().toString()
            copy(data)
        }
    }
    const web=[
        web_doc88,
        web_wenkubaidu,
        web_csdn,
        web_ruiwen,

    ]
 
    const initweb= async()=>{
        let webGetText=null;
        const match=(regexp,getContentText)=>{
            if(regexp.test(window.location.href)){
                webGetText=web.getContentText
                webGetText=getContentText
                console.log(window.location.href);
                return true
            }
            return false
        }
         web.some(item=>match(item.regexp,item.getContentText))
        return webGetText
    }
    initweb().then((webGetText) => {
        if(webGetText){
            webGetText()
        }
    }).catch((err) => {
        return 
    });
})()
