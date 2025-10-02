# 🚀 Flask + React Fullstack App with MongoDB, Docker & Jenkins CI/CD

## 📌 Project Overview
This is a **fullstack web application** that demonstrates use of cloud native architecture for modern software development and DevOps practices.  

- **Frontend**: React  
- **Backend**: Flask (Python REST API)  
- **Database**: MongoDB  
- **Containerization**: Docker  
- **CI/CD**: Jenkins Pipeline  

### Features
- ➕ Add items  
- 📋 List items  
- ❌ Delete items  

---

## 🏗️ Getting Started

### 1. Clone Repository
```
git clone https://https://github.com/SherryObuhuma/Cloud-Native-Task-Manager-Flask-React-MongoDB-.git

cd flask_fullstack

```

### 2. Backend Setup - Flask
```
cd backend
pip install -r requirements.txt
python app.py

```
Backend runs on: http://localhost:5001


### 3. Frontend Setup - React
```
cd frontend
npm install
npm start

```
Frontend runs on: http://localhost:3000


### 4. CI/CD with Jenkins
The project includes a Jenkinsfile and pipeline that:
- Pulls the latest code from GitHub
- Builds Docker images for frontend & backend
- Pushes images to DockerHub
- Deploys updated containers automatically


