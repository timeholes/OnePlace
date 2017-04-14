# OnePlace

Веб-клиент для блокчейнов Golos и Steem / Web-client for Golos and Steem blockchains

#### http://oneplace.media  
 
 

**Важно / Important notice:** 
*Для запуска приложения необходимо предварительно установить Node.js и менеджер пакетов NPM. / In order to run the application you must first install Node.js and NPM package manager.*


### Установка / Installation

```
npm install
```

### Настройка / Setup
Откройте config.json / Open config.json
```
 {
  "steem": {
    "host": "localhost",
    "port": 80
  },
  "golos": {
    "host": "localhost",
    "port": 80
  }
}
```
Пропишите адреса и порты для нод Стима и Голоса. / Edit hosts and ports for Steem and Golos nodes.
Например: / Example:
```
"golos": {
    "host": "node.golos.ws",
    "port": 80
  }
```

### Запуск / Run
```
npm start
```
Откройте в браузере localhost:8090 / Open localhost:8090 in the browser
