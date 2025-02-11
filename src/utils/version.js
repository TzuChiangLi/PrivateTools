let firstV = [] //记录初始获得的 script 文件字符串
let currentV = [] //记录当前获得的 script 文件字符串

// 获得的文件字符串类似这样 `<script src="/js/chunk-vendors.1234fff.js"></script>`

export const parserScript = (html) => {
    const reg = new RegExp(/<script(?:\s+[^>]*)?>(.*?)<\/script\s*>/ig) //script正则
    return html.match(reg) //匹配script标签
}
export async function getHtml() {
    let res = await fetch('/pc-manage/?date=' + Date.now()).then(res => res.text())
    return parserScript(res)
}

function isEqual(a , b) {
    if(Array.isArray(a)&&Array.isArray(b)){
        return a.length===b.length&&a.toString()===b.toString()
    }else{
        return a===b
    }
    // return a.length = Array.from(new Set(a.concat(b))).length
}

export async function checkVersionUpdate() {
    firstV = await getHtml()
    sessionStorage.setItem('firstVersion',JSON.stringify(firstV)||'')
    window.checkVersionInterval && clearInterval(window.checkVersionInterval)
    window.checkVersionInterval = setInterval(async () => {
        currentV = await getHtml()
        sessionStorage.setItem('currentVersion',JSON.stringify(currentV)||'')
        // 当前 script hash 和初始的不同时，说明已经更新
        if (!isEqual(firstV , currentV)) {
            sessionStorage.setItem('versionCompare','存在更新')
            window.checkVersionInterval && clearInterval(window.checkVersionInterval)
            setTimeout(()=>{
                sessionStorage.setItem('versionCompare','已更新')
                sessionStorage.setItem('lastUpdateTime',String(new Date().getTime()))
                window.location.reload()
            },10*1000)
        }else{
            sessionStorage.setItem('versionCompare','暂无新版本')
        }
    } , 120*1000)
}




export const startVersionUpdate = () => {
    checkVersionUpdate()
    // 文档可见时检测版本是否更新
    document.addEventListener("visibilitychange", () => {
        console.log('visibilityChange:',document.visibilityState)
        if (document.visibilityState === "visible") {
            checkVersionUpdate();
        } else {
            window.checkVersionInterval && clearInterval(window.checkVersionInterval)
        }
    });
}

export default { startVersionUpdate }
