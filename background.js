// Применение настроек прокси
function applyProxySettings() {
    chrome.storage.local.get(["proxyHost", "proxyDomains"], ({ proxyHost, proxyDomains }) => {
      if (!proxyHost || !proxyDomains) return;
  
      const pacScript = generatePacScript(proxyHost, proxyDomains);
      const proxyConfig = {
        mode: "pac_script",
        pacScript: {
          data: pacScript
        }
      };
  
      chrome.proxy.settings.set(
        { value: proxyConfig, scope: "regular" },
        () => console.log("Proxy settings applied.")
      );
    });
  }
  
  // Генерация PAC-скрипта
  function generatePacScript(proxyHost, proxyDomains) {
    const domainsList = proxyDomains.map(domain => `"${domain}"`).join(", ");
    return `
      function FindProxyForURL(url, host) {
        const proxyHosts = [${domainsList}];
        for (let i = 0; i < proxyHosts.length; i++) {
          if (dnsDomainIs(host, proxyHosts[i])) {
            return "PROXY ${proxyHost}";
          }
        }
        return "DIRECT";
      }
    `;
  }
  
  // Сообщаем Content Script о текущем домене
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkProxy") {
      chrome.storage.local.get(["proxyDomains"], ({ proxyDomains }) => {
        const isUsingProxy = proxyDomains && proxyDomains.includes(message.domain);
        sendResponse({ isUsingProxy });
      });
      return true; // Указываем, что ответ будет асинхронным
    }
  });
  
  // Применяем настройки при запуске
  applyProxySettings();
  