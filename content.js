const domain = window.location.hostname;

// Отправляем запрос на проверку прокси
chrome.runtime.sendMessage({ action: "checkProxy", domain }, response => {
  if (response && response.isUsingProxy) {
    // Создаём уведомление
    const notification = document.createElement("div");
    notification.textContent = "This site is using a proxy.";
    notification.style.position = "fixed";
    notification.style.bottom = "10px";
    notification.style.right = "10px";
    notification.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    notification.style.color = "white";
    notification.style.padding = "10px";
    notification.style.borderRadius = "5px";
    notification.style.zIndex = "9999";
    document.body.appendChild(notification);

    // Убираем уведомление через 5 секунд
    setTimeout(() => notification.remove(), 5000);
  }
});
