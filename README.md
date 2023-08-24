# MeowMeet

## 簡介

一個能為住家或公司附近的街貓建檔的應用地圖，使用者能在街貓檔案中進行按讚、留言、新增影音等互動


#### | 搜尋主頁
![image](https://github.com/goodjobhot401/MeowMeet/blob/meowmeet/%E5%9C%96%E7%89%872.png)

#### | 街貓檔案
![image](https://github.com/goodjobhot401/MeowMeet/blob/meowmeet/%E5%9C%96%E7%89%871.png)



## 開發環境與套件
* VS Code - 編程環境
* node.js / express.js@4.16.4- 後端框架
* MySQL - 資料庫
* sequelize@6.18.0 - MySQL ORM

---

## 功能

### | 未登入使用者
- 可透過搜尋欄，查詢該地區的街貓檔案
- 點選搜尋結果的街貓檔案，可瀏覽該街貓詳細資訊

### | 登入使用者
- 註冊/登入
- 可新增街貓檔案，讓其他使用者搜尋
- 可對街貓檔案進行按讚、留言、新增圖片或 mp4 影像檔
- 可對其他使用者的留言按讚
- 可至「我的街貓」查看目前建立的街貓檔案及新增的圖片，並能透過編輯進行管理
- 可至「帳號設定」編輯目前的帳號、密碼、暱稱
- 可點選左方頭像，將預設大頭貼進行更換

---

## 專案初始化

### 1. 確認已安裝 node.js 與 npm

   - node.js 可透過nvm進行安裝,而 npm 會在安裝 node.js 自動下載。
  - nvm 安裝方式[傳送門](https://github.com/creationix/nvm)
  - node.js 安裝方式:
  ```bash
  $ nvm install 14.16.0
  ```

### 2. 開啟Terminal, 將此專案 Clone 到本地
``` bash 
$ git clone https://github.com/MeowMeet/.git
```

### 3. 進入此專案資料夾, 並切換至 meowmeet 分支
```bash
$ cd MeowMeet
$ git checkout meowmeet
```

### 4. 安裝本專案 npm 套件
``` bash 
$ npm install
```

### 5. 參考 `.env.example` 檔案，重構 `.env` 環境
- 特別注意需要, 此專案須至 redis labs & imgur 申請帳號密碼並加入 .env 環境變數中

### 6. 設定資料庫
- 在 MySQL Workbench 輸入以下指令，
注意名稱需要與 config/config.json 一致

```
create database meowmeet;
```

### 7. 設定資料
```bash
$ npx sequelize db:migrate
```

### 8. 建立種子資料
```bash
$ npx sequelize db:seed:all
```

### 9. 安裝、建立資料完畢接續輸入
```bash
$ npm run start
```

### 10. 當Terminal顯示以下訊息，代表伺服器已成功運行，可前往 http://localhost:3000 體驗

  ```
  App is running now!
  ```

### 11. 使用種子資料裡的測試帳號進行測試
account: user1
password: 12345678

account: user2
password: 12345678


### 12. 若欲暫停使用

  ```
  ctrl + c
  ```

---





