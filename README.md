# 🎬 Video Trim Tool

A local media handling tool using:

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Processing:** FFmpeg  

---

## 📖 Overview

This application allows you to:

- Select videos from a mounted input folder  
- Trim videos by start and end time  
- Re-encode into supported output formats  
- Save processed videos to an output folder  
- Run everything locally inside Docker  

No file uploads are required. Files are processed directly from a mounted host directory.

---

## 🖥️ Frontend

- Trim videos  
- Re-encode into different format  

---

## 🛠️ Backend

The backend:

- Exposes REST API  
- Executes FFmpeg via `child_process`  
- Reads from mounted input directory  
- Writes to mounted output directory  

---

## ⚙️ Environment Variables

**Required:**

```env
INPUT_FOLDER=/video
OUTPUT_FOLDER=/video/Trimmed
````

---

## 🚀 Running

```bash
docker compose up --build
```

### Frontend

```
http://localhost:5173
```

### Backend

```
http://localhost:3001
```

---

## 📝 Notes

* Input directory is mounted read-only
* Output directory is writable
* Backend constructs full paths internally using environment variables
