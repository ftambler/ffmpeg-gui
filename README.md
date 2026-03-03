# 🎬 Video Trim Tool

A local media handling tool using:

- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Processing:** FFmpeg  

---

## Overview

This application allows you to:

- Select multiple videos from a mounted input folder  
- Trim videos by start and end time  
- Concatenate multiple videos together
- Re-encode into supported output formats  
- Save processed videos to an output folder  
- Run everything locally inside Docker  

No file uploads are required. Files are processed directly from a mounted host directory.

---

## Frontend

- Trim and Concatenate videos  
- Re-encode into different format  

---

## Backend

The backend:

- Exposes REST API  
- Executes FFmpeg via `child_process`  
- Reads from mounted input directory  
- Uses temporary folder to work
- Writes to mounted output directory  

---

## Environment Variables

**Required:**

```env
INPUT_FOLDER=/video
TEMP_FOLDER=/tmp
OUTPUT_FOLDER=/video/Trimmed
````
**Dev Only:**

```env
VITE_API_URL=http://localhost:3000/api
```

---

##  Running

```bash
docker compose up --build
```

### Frontend

```
http://localhost:3000
```