# PACS-VTS
A PACS server based on Python and React
## 简单操作步骤
### 运行系统
1. 在终端进入ndicom_server（服务器）目录

    **`cd ndicom_server`**  
    
2. 运行install_and_run.sh  

    **`sh install_and_run.sh`**
3. 在终端进入pacs（客户端）目录

    **`cd pacs`**
4. 在终端依次输入以下命令

    **`npm install`**  
    **`npm run start`**
    
### 修改服务器
1. 打开pacs文件夹下的package.json 

2. 直接修改“proxy”对应的地址为相应服务器地址即可
