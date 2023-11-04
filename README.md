## REACTJS PROJECT 

- node version: nodejs v16.20.0
- api-port: 3001
- gui-port: 3000

### 1. How to run API
```
    cd /api-reactjs-project
    npm install
    npm run start:dev
```

### 2. How to run GUI
```
    cd /gui-reactjs-project
    npm install
    npm run dev
```

### 3. How to DEV
```mermaid
sequenceDiagram
    participant Main branch
    participant Dev branch
    participant Task demo
    Note over Dev branch: Triển khai các task như này theo như thầy nói nhé!!!!
    Main branch->>Dev branch: được tạo ra từ main
    Dev branch->>Task demo: Được tạo ra từ dev
    Task demo->> Dev branch: Sau khi hoàn thành, merge vào dev
    Dev branch->> Main branch: Sau khi được verify, merge vào main
```