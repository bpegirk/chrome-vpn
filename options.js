// Загружаем текущие настройки
chrome.storage.local.get(["proxyHost", "proxyDomains"], ({ proxyHost, proxyDomains }) => {
    document.getElementById("proxyHost").value = proxyHost || "";
    const hostList = proxyDomains || [];
    updateHostList(hostList);
  });
  
  // Добавляем новый хост
  document.getElementById("addHost").addEventListener("click", () => {
    const newHostInput = document.getElementById("newHost");
    const newHost = newHostInput.value.trim();
  
    if (newHost) {
      const hostListElement = document.getElementById("hostList");
      const currentHosts = Array.from(hostListElement.querySelectorAll("li span")).map(el => el.textContent);
  
      if (!currentHosts.includes(newHost)) {
        currentHosts.push(newHost);
        updateHostList(currentHosts);
      }
  
      newHostInput.value = "";
    }
  });
  
  // Сохраняем настройки
  document.getElementById("saveSettings").addEventListener("click", () => {
    const proxyHost = document.getElementById("proxyHost").value;
    const hostList = Array.from(document.querySelectorAll("#hostList li span")).map(el => el.textContent);
  
    chrome.storage.local.set({ proxyHost, proxyDomains: hostList }, () => {
      alert("Settings saved!");
    });
  });
  
  // Удаление хоста
  function removeHost(host) {
    const hostListElement = document.getElementById("hostList");
    const currentHosts = Array.from(hostListElement.querySelectorAll("li span")).map(el => el.textContent);
    const updatedHosts = currentHosts.filter(h => h !== host);
    updateHostList(updatedHosts);
  }
  
  // Обновляем список хостов
  function updateHostList(hosts) {
    const hostListElement = document.getElementById("hostList");
    hostListElement.innerHTML = "";
  
    hosts.forEach(host => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = host;
  
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.classList.add("remove-btn");
      removeButton.addEventListener("click", () => removeHost(host));
  
      li.appendChild(span);
      li.appendChild(removeButton);
      hostListElement.appendChild(li);
    });
  }
  