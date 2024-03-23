// ==UserScript==
// @name         AUTO EVALUATE
// @namespace    http://tampermonkey.net/
// @version      2024-03-23
// @description  You can evaluate teachers easily!
// @author       Mobiusp
// @match        http://218.197.101.69:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=101.69
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const Panel = {
        ind: 1,
        maxInd: 1,
        courses: [],
        numOfOnePage: 20,
        isUpdate: false,
        hadEvaluateInd: -1,
        isEvaluating: false,
        nextPage: () => {
            if (Panel.maxInd == 1) return;
            if (Panel.ind == Panel.maxInd) {
                document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-pager.pagination > table > tbody > tr > td:nth-child(3) > a").click ();
                Panel.ind = 1;
            }else {
                document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-pager.pagination > table > tbody > tr > td:nth-child(10) > a").click ();
                ++ Panel.ind;
            }
        },
        initCourses: () => {
            document.querySelector("#con > div.tabs-header.tabs-header-noborder > div.tabs-wrap > ul > li.tabs-first > a").click ();
            const intervalId1 = setInterval (() => {
                if (document.querySelector ("iframe").contentDocument.querySelector("body > div > div:nth-child(2) > a.homeUpaBule03") == null) return;
                document.querySelector ("iframe").contentDocument.querySelector("body > div > div:nth-child(2) > a.homeUpaBule03").click ();
                const intervalId2 = setInterval (() => {
                    if (document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#datagrid-row-r1-1-0 > td.datagrid-td-rownumber > div") == null) return;
                    Panel.initPageData ();
                    const intervalId3 = setInterval(() => {
                        if (document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#datagrid-row-r1-1-0 > td.datagrid-td-rownumber > div") == null) return;
                        if (Number.parseInt (document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#datagrid-row-r1-1-0 > td.datagrid-td-rownumber > div").innerText) != (Panel.ind - 1) * Panel.numOfOnePage + 1) return;
                        const evaluate = document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-view > div.datagrid-view1 > div.datagrid-body > div > table > tbody");
                        let tempInd = 0;
                        for (const item of evaluate.children) {
                            const a = item.querySelector ("a");
                            if (a.innerText == "评价" && a.getAttribute ("onclick").indexOf ("noEval") == -1) {
                                const clickFun = a.getAttribute ("onclick");
                                Panel.courses.push ({
                                    ind: tempInd,
                                    page: Panel.ind,
                                    courseName: "",
                                    teacherName: "",
                                    isEvaluate: true,
                                    value: clickFun.substring (clickFun.indexOf ("doEval(event,'") + 14, clickFun.length - 2)
                                });
                            }
                            ++ tempInd;
                        }
                        const domCourses = document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-body > table > tbody");
                        for (const item of Panel.courses) {
                            if (item.page != Panel.ind) continue;
                            item.courseName = domCourses.children[item.ind].children[7].children[0].innerText;
                            item.teacherName = domCourses.children[item.ind].children[4].children[0].innerText;
                        }
                        if (Panel.ind == Panel.maxInd) {
                            const courseUl = document.querySelector ("#courses");
                            for (const item of Panel.courses) {
                                courseUl.insertAdjacentHTML ("beforeend", `<li class="course-li">
                                <input class="course-li-checkbox" type="checkbox" name="${(item.page - 1) * Panel.numOfOnePage + item.ind}">
                                <div class="course-li-name course-li-teacher-name">${item.teacherName}</div>
                                <div class="course-li-name">${item.courseName}</div>
                            </li>`);
                            }
                            Panel.isUpdate = true;
                            clearInterval (intervalId3);
                        }
                        Panel.nextPage ();
                    }, 50);
                    clearInterval (intervalId2);
                }, 50);
                clearInterval (intervalId1);
            }, 50);
        },
        initPageData: () => {
            const temp = document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-pager.pagination > table > tbody > tr > td:nth-child(8) > span").innerText;
            Panel.maxInd = Number.parseInt (temp.substring (2, temp.length - 2));
            Panel.numOfOnePage = Number.parseInt (document.querySelectorAll ("iframe")[1].contentDocument.querySelector("#container > div.panel.layout-panel.layout-panel-center > div > div > div > div.datagrid-pager.pagination > table > tbody > tr > td:nth-child(1) > select").selectedOptions[0].innerText);
        },
        show: () => {
            document.head.insertAdjacentHTML ("afterbegin", `<style>
		#outer {
			overflow: hidden;
			position: absolute;
			right: 100px;
			background-color: rgba(135, 206, 235, .8);
			width: 480px;
			height: 48px;
			border-radius: 18px;
			transition: height .5s ease-in-out;
			z-index: 393939;
		}
		#drag-bar {
			display: inline-block;
			margin-left: 18px;
			user-select: none;
			width: 150px;
			height: 48px;
			line-height: 45px;
			text-align: center;
		}
		#drag-bar:hover {
			cursor: move;
		}
		#btn-line {
			position: absolute;
			top: 0;
			right: 0;
			width: 220px;
			height: 48px;
		}
		.course-btn {
			display: inline-block;
			margin-top: 6px;
			margin-right: 18px;
			width: 88px;
			height: 36px;
			line-height: 36px;
			text-align: center;
			border-radius: 18px;
			font-size: 18px;
			background-color: skyblue;
			user-select:none
		}
		.course-btn:hover {
			cursor: pointer;
			background-color: rgb(105, 176, 205);
		}
		.course-btn:active {
			background-color: skyblue;
		}
		#nav-btn {
			position: absolute;
			bottom: 0;
			left: 203px;
			width: 48px;
			background-color: rgba(128, 128, 128, .3);
			height: 18px;
			transition: background-color .3s ease-in-out;
			z-index: 393939;
		}
		#nav-btn:hover {
			cursor: pointer;
			background-color: rgba(128, 128, 128, .8);
		}
		#nav-btn-after {
			border-radius: 10px;
			border-left: 10px solid rgb(255,255,255);
			border-bottom: 10px solid rgb(255,255,255);
			box-sizing: border-box;
			height: 48px;
			width: 48px;
			content: '';
			position: absolute;
			transform: scale(.25) translateX(0) translateY(-80px) rotate(315deg);
		}
		#course-selector {
			width: 450px;
			margin: auto;
		}
		#courses {
			padding: 0;
			margin: 0;
			overflow: auto;
			max-height: 240px;
			list-style: none;
		}
		#courses::-webkit-scrollbar {
			appearance: none;
			width: 12px;
		}
		#courses::-webkit-scrollbar-thumb {
			border-radius: 2px;
			background-color: skyblue;
		}

		#courses::-webkit-scrollbar-track {
			background-color: rgba(180,180,180,0.3);
		}
		.course-li {
			box-sizing: border-box;
			display: flex;
			flex-shrink: 0;
			padding: 0;
			width: 99%;
			height: 30px;
			margin-bottom: 6px;
		}
		.course-li-checkbox {
			box-sizing: border-box;
			margin: 3px 0;
			margin-right: 6px;
			width: 24px;
			height: 24px;
		}
		.course-li-teacher-name {
			width: 88px !important;
		}
		.course-li-name {
			box-sizing: border-box;
			overflow: hidden;
			display: inline-block;
			margin: 0;
			padding-left: 6px;
			width: 300px;
			height: 30px;
			line-height: 30px;
			white-space: nowrap;
			text-overflow: ellipsis;
			border: 1px solid black;
		}
	</style>`);
            document.body.insertAdjacentHTML ("beforebegin", `<div id="outer">
		<div id="drag-bar">AUTO EVALUATION</div>
		<div id="btn-line">
			<div id="update-courses" class="course-btn">获取课程</div>
			<div id="start-btn" class="course-btn" style="background-color: gray;">开始评教</div>
		</div>
		<div id="course-selector">
			<div class="course-li" style="margin: 10px 0;">
                <input class="course-li-checkbox" type="checkbox" id="check-all" >
				<div class="course-li-name course-li-teacher-name" style="padding: 0 !important;text-align: center;font-size: 18px !important;color: rgb(30, 30, 200);">教师</div>
				<div class="course-li-name" style="padding: 0 !important;text-align: center;font-size: 18px !important;color: rgb(30, 30, 200);">课程</div>
			</div>
			<ul id="courses">

			</ul>
		</div>
		<div id="nav-btn">
			<span id="nav-btn-after"></span>
		</div>
	</div>`);
            const intervalId = setInterval (() => {
                if (document.querySelector ("#outer") == null) return;
                const dragBar = document.querySelector ("#drag-bar");
                const outer = document.querySelector ("#outer");
                const navBtn = document.querySelector ("#nav-btn");
                const navBtnAfter = document.querySelector ("#nav-btn-after");
                const updateCourse = document.querySelector ("#update-courses");
                const startBtn = document.querySelector ("#start-btn");
                const checkAll = document.querySelector ("#check-all");
                const coursesUl = document.querySelector ("#courses");
                let coursesCheckBox = null;

                let isDrag = false, pos = {x: 0, y: 0}, last_pos = {x: 0, y: 0}, isLaunch = false;
                document.onmousemove = (e) => {
                    if (isDrag) {
                        pos.x += e.screenX - last_pos.x;
                        pos.y += e.screenY - last_pos.y;
                        outer.style.transform = `translateX(${pos.x}px) translateY(${pos.y}px)`;
                    }
                    last_pos.x = e.screenX;
                    last_pos.y = e.screenY;
                };
                dragBar.onmousedown = () => {
                    isDrag = true;
                };
                document.onmouseup = () => {
                    isDrag = false;
                };
                let framesLen = -1;
                setInterval (() => {
                    if (framesLen == window.length) return;
                    if (framesLen == -1) framesLen = window.length;
                    for (const item of document.querySelectorAll("iframe")) {
                        if (item.contentDocument.onmousemove == null) {
                            item.contentDocument.onmousemove = (e) => {
                                if (isDrag) {
                                    pos.x += e.screenX - last_pos.x;
                                    pos.y += e.screenY - last_pos.y;
                                    outer.style.transform = `translateX(${pos.x}px) translateY(${pos.y}px)`;
                                }
                                last_pos.x = e.screenX;
                                last_pos.y = e.screenY;
                            };
                        }
                        if (item.contentDocument.onmouseup == null) item.contentDocument.onmouseup = document.onmouseup;
                    }
                }, 500);
                navBtn.onclick = () => {
                    if (isLaunch) {
                        outer.style.height = "48px";
                        navBtnAfter.style.transform = "scale(.25) translateX(0) translateY(-80px) rotate(315deg)";
                    } else {
                        outer.style.height = "360px";
                        navBtnAfter.style.transform = "scale(.25) translateX(0) translateY(-60px) rotate(135deg)";
                    }
                    isLaunch = ! isLaunch;
                };
                let isCheckAll = false;
                let checkedLength = 0;
                checkAll.onclick = () => {
                    if (! Panel.isUpdate) {
                        checkAll.checked = isCheckAll;
                        return;
                    }
                    if (isCheckAll) checkedLength = 0;
                    else checkedLength = coursesUl.children.length;
                    isCheckAll = ! isCheckAll;
                    for (const item of coursesCheckBox) {
                        item.checked = isCheckAll;
                    }
                };
                updateCourse.onclick = () => {
                    try {
                        Panel.initCourses ();
                        updateCourse.onclick = null;
                        updateCourse.style.backgroundColor = "gray";
                        const intervalId1 = setInterval (() => {
                            if (! Panel.isUpdate || coursesUl.children.length != Panel.courses.length) return;
                            coursesCheckBox = coursesUl.querySelectorAll (".course-li > .course-li-checkbox");
                            checkedLength = Panel.courses.length;
                            for (const item of coursesCheckBox) {
                                item.onclick = () => {
                                    if (item.checked) ++ checkedLength;
                                    else -- checkedLength;
                                    if (checkedLength == coursesUl.children.length) {
                                        checkAll.checked = true;
                                        isCheckAll = true;
                                    }else {
                                        checkAll.checked = false;
                                        isCheckAll = false;
                                    }
                                };
                            }
                            checkAll.click ();
                            startBtn.style.backgroundColor = "skyblue";
                            startBtn.onclick = () => {
                                try {
                                    let tempInd = 0;
                                    for (const item of coursesCheckBox) {
                                        if (! item.checked) {
                                            Panel.courses[tempInd].isEvaluate = false;
                                        }
                                        ++ tempInd;
                                    }
                                    console.log ("评教开始，请不要刷新此页面。");
                                    startBtn.onclick = null;
                                    startBtn.style.backgroundColor = "gray";
                                    startBtn.innerText = "正在评教";
                                    startBtn.onmouseover = null;
                                    startBtn.onmouseout = null;
                                    startBtn.onmousedown = null;
                                    startBtn.onmouseup = null;
                                    let openWindow = null;
                                    const evaluateInterval = setInterval (() => {
                                        if (Panel.isEvaluating) return;
                                        Panel.isEvaluating = true;
                                        if (Panel.hadEvaluateInd == Panel.courses.length - 1) {
                                            if (openWindow != null) openWindow.close ();
                                            alert ("评教完成!");
                                            startBtn.innerText = "评教完成";
                                            clearInterval (evaluateInterval);
                                            return;
                                        }
                                        if (! Panel.courses[++ Panel.hadEvaluateInd].isEvaluate) {
                                            Panel.isEvaluating = false;
                                            return;
                                        }
                                        if (openWindow == null) openWindow = window.open("/edu/task/evaluate/" + Panel.courses[Panel.hadEvaluateInd].value);
                                        else openWindow.location = "/edu/task/evaluate/" + Panel.courses[Panel.hadEvaluateInd].value;
                                        localStorage.setItem ("mobiusp-t-s", "m");
                                        const intervalId = setInterval (() => {
                                            if (localStorage.getItem ("mobiusp-t-s").length != 2) return;
                                            localStorage.setItem ("mobiusp-t-s", localStorage.getItem ("mobiusp-t-s") + "m");
                                            const intervalId1 = setInterval (() => {
                                                if (localStorage.getItem ("mobiusp-t-s").length != 5) return;
                                                Panel.isEvaluating = false;
                                                clearInterval (intervalId1);
                                            }, 100);
                                            clearInterval (intervalId);
                                        }, 100);
                                    }, 100);
                                }catch (error) {
                                    $.messager.alert ("Auto Evaluation", "自动评教出错，请尝试反馈issue。", "question");
                                }
                            };
                            startBtn.onmouseover = () => {
                                startBtn.style.backgroundColor = "rgb(105, 176, 205)";
                            };
                            startBtn.onmouseout = () => {
                                startBtn.style.backgroundColor = "skyblue";
                            };
                            startBtn.onmousedown = () => {
                                startBtn.style.backgroundColor = "skyblue";
                            };
                            startBtn.onmouseup = () => {
                                startBtn.style.backgroundColor = "rgb(105, 176, 205)";
                            };
                            clearInterval (intervalId1);
                        }, 100);
                        if (! isLaunch) navBtn.click ();
                    }catch (error) {
                        $.messager.alert ("Auto Evaluation", "获取课程错误，请尝试反馈issue。", "question");
                    }
                };
                clearInterval (intervalId);
            }, 100);
        },
        evaluate: () => {
            try {
                if (localStorage.getItem ("mobiusp-t-s") != null && localStorage.getItem ("mobiusp-t-s").length == 4) {
                    localStorage.setItem ("mobiusp-t-s", localStorage.getItem ("mobiusp-t-s") + "m");
                    // window.close ();
                    return;
                }
                if (localStorage.getItem ("mobiusp-t-s") == null || localStorage.getItem ("mobiusp-t-s").length != 1) return;
                localStorage.setItem ("mobiusp-t-s", localStorage.getItem ("mobiusp-t-s") + "m");
                let times = 0;
                const intervalId = setInterval (() => {
                    ++ times;
                    if (times > 100) clearInterval (intervalId);
                    if (localStorage.getItem ("mobiusp-t-s") != null && localStorage.getItem ("mobiusp-t-s").length != 3) return;
                    const intervalId1 = setInterval (() => {
                        if (document.readyState == "complete") {
                            const selectItem = document.querySelectorAll ("tbody > .suject-box");
                            for (const item of selectItem) {
                                if (item.querySelector ("i").className.indexOf ("check") == -1) {// != "fa fa-check-square-o") {
                                    item.querySelector (".exam-select").click ();
                                }
                            }
                            localStorage.setItem ("mobiusp-t-s", localStorage.getItem ("mobiusp-t-s") + "m");
                            document.querySelector("body > div.detail-header > div.detail-header-nav > div > a.demo-btn.big.green.edit-btn").click ();
                            clearInterval (intervalId1);
                        }
                    }, 250);
                    clearInterval (intervalId);
                }, 100);
            }catch (error) {
                $.messager.alert ("Auto Evaluation", "自动评教失败，请尝试反馈issue。", "question");
            }
        }
    }

    window.onload = () => {
        if (location.href.match ("http://218.197.101.69:8080/index")) {
            localStorage.removeItem ("mobiusp-t-s");
            Panel.show ();
        }else if (location.href.startsWith ("http://218.197.101.69:8080/edu/task/evaluate")) Panel.evaluate ();
    };
})();