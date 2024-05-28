// ==UserScript==
// @name         Verify Name Facebook v2.5.0
// @namespace    http://tampermonkey.net/
// @version      2.5.0
// @description  Script này được lập trình bởi Developers Official, mục tiêu là làm đẹp thôi. Nếu thấy hay Subcriber kênh Youtube cho mình nhé. Mình cảm ơn các bạn nhiều :333
// @author       Developers Official (https://www.youtube.com/@nmhruby)
// @match        *://*.facebook.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    let targetClass = GM_getValue('targetClass', '');
    let newHtml = GM_getValue('newHtml', '');
    let alwaysSave = GM_getValue('alwaysSave', false);
    let customName = GM_getValue('customName', '');
    let customNickname = GM_getValue('customNickname', '');
    let editEnabled = GM_getValue('editEnabled', false);
    let customNicknameEnabled = GM_getValue('customNicknameEnabled', false);
    let scriptEnabled = GM_getValue('scriptEnabled', true);
    let menuVisible = false;

    // Add styles for the menu
    GM_addStyle(`
        .custom-menu {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 1px solid #ccc;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
        }
        .custom-menu input, .custom-menu button, .custom-menu textarea {
            display: block;
            margin: 10px 0;
        }
        .hidden {
            display: none;
        }
    `);

    // Function to create the menu
    function createMenu() {
        const menu = document.createElement('div');
        menu.className = 'custom-menu hidden';
        menu.id = 'customMenu';
        menu.innerHTML = `
            <label>Paste thẻ class</label>
            <input type="text" id="classInput" value="${targetClass}">
            <label>Paste mã HTML mới</label>
            <textarea id="htmlInput">${newHtml}</textarea>
            <label>Custom Name</label>
            <input type="text" id="nameInput" value="${customName}">
            <label>Custom Nickname</label>
            <input type="text" id="nicknameInput" value="${customNickname}">
            <label>Always Save HTML</label>
            <input type="checkbox" id="saveInput" ${alwaysSave ? 'checked' : ''}>
            <button id="importButton">Import Settings</button>
            <button id="exportButton">Export Settings</button>
            <button id="saveButton">Save Settings</button>
            <button id="toggleEditButton">${editEnabled ? 'Disable' : 'Enable'} Edit</button>
            <button id="toggleNicknameButton">${customNicknameEnabled ? 'Disable' : 'Enable'} Custom Nickname</button>
            <button id="closeButton">Close</button>
        `;
        document.body.appendChild(menu);

        // Add event listeners
        document.getElementById('importButton').addEventListener('click', importSettings);
        document.getElementById('exportButton').addEventListener('click', exportSettings);
        document.getElementById('saveButton').addEventListener('click', saveSettings);
        document.getElementById('toggleEditButton').addEventListener('click', () => {
            editEnabled = !editEnabled;
            GM_setValue('editEnabled', editEnabled);
            alert(editEnabled ? 'Editing enabled' : 'Editing disabled');
            document.getElementById('toggleEditButton').innerText = editEnabled ? 'Disable Edit' : 'Enable Edit';
        });
        document.getElementById('toggleNicknameButton').addEventListener('click', () => {
            customNicknameEnabled = !customNicknameEnabled;
            GM_setValue('customNicknameEnabled', customNicknameEnabled);
            alert(customNicknameEnabled ? 'Custom Nickname enabled' : 'Custom Nickname disabled');
            document.getElementById('toggleNicknameButton').innerText = customNicknameEnabled ? 'Disable Custom Nickname' : 'Enable Custom Nickname';
        });
        document.getElementById('closeButton').addEventListener('click', toggleMenuVisibility);
    }

    // Function to toggle menu visibility
    function toggleMenuVisibility() {
        if (!scriptEnabled) return; // Disable menu when script is disabled
        const menu = document.getElementById('customMenu');
        if (menu) {
            menuVisible = !menuVisible;
            menu.classList.toggle('hidden', !menuVisible);
        }
    }

    // Function to toggle script enabled state
    function toggleScriptEnabled() {
        scriptEnabled = !scriptEnabled;
        GM_setValue('scriptEnabled', scriptEnabled);
        if (!scriptEnabled) { // Hide menu when disabling script
            const menu = document.getElementById('customMenu');
            if (menu) {
                menuVisible = false;
                menu.classList.add('hidden');
            }
        }
        alert(scriptEnabled ? 'Script enabled' : 'Script disabled');
    }

    // Function to modify the HTML of the target class
    function modifyHtml() {
        if (!scriptEnabled) return;
        const elements = document.getElementsByClassName(targetClass);
        if (elements.length > 0) {
            const confirmed = confirm('Developers Official thông báo! Bạn có muốn thay đổi những nội dung trong Script bạn vừa chỉnh sửa');
            if (confirmed) {
                let customizedHtml = newHtml.replace(/CUSTOM NAME/g, customName);
                if (customNicknameEnabled) {
                    customizedHtml = customizedHtml.replace(/CUSTOM NICKNAME/g, customNickname);
                } else {
                    customizedHtml = customizedHtml.replace(/\(CUSTOM NICKNAME\)/g, ''); // Xóa luôn cả cặp dấu ngoặc
                }
                Array.from(elements).forEach(el => {
                    el.innerHTML = customizedHtml;
                });
            }
        }
    }

    // Import settings from a file
    function importSettings() {
        const input = prompt('Paste your settings here:');
        if (input) {
            try {
                const settings = JSON.parse(input);
                targetClass = settings.targetClass || '';
                newHtml = settings.newHtml || '';
                customName = settings.customName || '';
                customNickname = settings.customNickname || '';
                customNicknameEnabled = settings.customNicknameEnabled || false;
                alwaysSave = settings.alwaysSave || false;
                GM_setValue('targetClass', targetClass);
                GM_setValue('newHtml', newHtml);
                GM_setValue('customName', customName);
                GM_setValue('customNickname', customNickname);
                GM_setValue('customNicknameEnabled', customNicknameEnabled);
                GM_setValue('alwaysSave', alwaysSave);
                document.getElementById('classInput').value = targetClass;
                document.getElementById('htmlInput').value = newHtml;
                document.getElementById('nameInput').value = customName;
                document.getElementById('nicknameInput').value = customNickname;
                document.getElementById('saveInput').checked = alwaysSave;
                alert('Settings imported successfully!');
            } catch (error) {
                alert('Invalid settings format!');
            }
        }
    }

    // Export settings to a file
    function exportSettings() {
        const settings = {
            targetClass,
            newHtml,
            customName,
            customNickname,
            customNicknameEnabled,
            alwaysSave
        };
        const output = JSON.stringify(settings, null, 2);
        GM_setClipboard(output);
        alert('Settings copied to clipboard. You can paste them anywhere.');
    }

    // Save settings
    function saveSettings() {
        targetClass = document.getElementById('classInput').value;
        newHtml = document.getElementById('htmlInput').value;
        customName = document.getElementById('nameInput').value;
        customNickname = document.getElementById('nicknameInput').value;
        alwaysSave = document.getElementById('saveInput').checked;
        GM_setValue('targetClass', targetClass);
        GM_setValue('newHtml', newHtml);
        GM_setValue('customName', customName);
        GM_setValue('customNickname', customNickname);
        GM_setValue('customNicknameEnabled', customNicknameEnabled);
        GM_setValue('alwaysSave', alwaysSave);
        alert('Settings saved successfully!');
    }

    // Add context menu event
    document.addEventListener('contextmenu', (e) => {
        if (!scriptEnabled) return;
        e.preventDefault();
        const x = e.pageX;
        const y = e.pageY;
        const contextMenu = document.createElement('div');
        contextMenu.style.position = 'absolute';
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.background = '#fff';
        contextMenu.style.border = '1px solid #ccc';
        contextMenu.style.padding = '10px';
        contextMenu.style.zIndex = '10000';
        contextMenu.innerHTML = `
            <button id="changeButton">Change</button>
        `;
        document.body.appendChild(contextMenu);

        document.getElementById('changeButton').addEventListener('click', () => {
            modifyHtml();
            document.body.removeChild(contextMenu);
        });

        document.addEventListener('click', () => {
            if (document.body.contains(contextMenu)) {
                document.body.removeChild(contextMenu);
            }
        }, { once: true });
    });

    // Add a button to toggle the menu
    const menuButton = document.createElement('button');
    menuButton.innerText = 'Developers Official | Open Script Menu';
    menuButton.style.position = 'fixed';
    menuButton.style.bottom = '10px';
    menuButton.style.right = '10px';
    menuButton.style.zIndex = '10000';
    document.body.appendChild(menuButton);

    menuButton.addEventListener('click', toggleMenuVisibility);

    // Add hotkey to toggle menu visibility and script enabled state
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
            toggleScriptEnabled();
            toggleMenuVisibility();
        }
    });

    // Create menu on script load
    createMenu();
})();