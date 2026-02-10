# 📁 File Upload Feature - Complete Guide

## ✅ **What's New**

I've added **file upload capability** to Cleara! You can now upload files instead of just pasting JSON.

---

## 🎯 **Supported File Types**

### **Text Files**
- `.txt` - Plain text
- `.csv` - Comma-separated values
- `.json` - JSON data
- `.xml` - XML documents
- `.log` - Log files

### **Documents**
- `.pdf` - PDF documents
- `.doc`, `.docx` - Word documents

### **Images**
- `.jpg`, `.jpeg` - JPEG images
- `.png` - PNG images
- `.gif` - GIF images
- `.webp` - WebP images

### **Spreadsheets**
- `.xlsx` - Excel (new format)
- `.xls` - Excel (old format)

### **Code Files**
- `.py` - Python
- `.js` - JavaScript
- `.html` - HTML
- `.css` - CSS
- `.java` - Java
- `.cpp` - C++

---

## 🚀 **How to Use**

### **Option 1: Playground (Frontend)**

1. Go to: http://localhost:3000/playground
2. Click the **"File"** tab (top right of input panel)
3. **Drag & drop** a file or **click to browse**
4. See file preview
5. Click **"Run Workflow"**

### **Option 2: API Endpoint (Backend)**

#### **Single File Upload**

```bash
curl -X POST "http://localhost:8000/v1/upload/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/file.csv" \
  -F "instructions=Clean and validate this data"
```

#### **Multiple Files Upload**

```bash
curl -X POST "http://localhost:8000/v1/upload/upload/multiple" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@/path/to/file1.csv" \
  -F "files=@/path/to/file2.json" \
  -F "instructions=Process these files"
```

---

## 📊 **File Limits**

| Limit | Value |
|-------|-------|
| **Max file size** | 10 MB per file |
| **Max files (multiple upload)** | 5 files |
| **Total size (multiple)** | 20 MB |

---

## 🎨 **Playground Features**

### **Toggle Between Modes**
- **JSON Mode**: Paste JSON directly
- **File Mode**: Upload files

### **File Upload Area**
- Drag & drop support
- Click to browse
- File preview
- File size display
- Remove file button

### **Supported Actions**
- View file preview
- See file metadata
- Process with AI workflow
- Download results

---

## 🔧 **API Endpoints**

### **POST /v1/upload/upload**
Upload a single file

**Parameters:**
- `file` (required): The file to upload
- `instructions` (optional): Processing instructions

**Response:**
```json
{
  "success": true,
  "file": {
    "filename": "data.csv",
    "type": "text",
    "size": 1024,
    "content_preview": "name,email,phone...",
    "line_count": 100,
    "char_count": 5000
  },
  "instructions": "Clean and validate"
}
```

### **POST /v1/upload/upload/multiple**
Upload multiple files at once

**Parameters:**
- `files` (required): Array of files (max 5)
- `instructions` (optional): Processing instructions

**Response:**
```json
{
  "success": true,
  "files_processed": 3,
  "total_files": 3,
  "total_size": 3072,
  "results": [
    {
      "filename": "file1.csv",
      "success": true,
      "size": 1024,
      "type": "CSV"
    }
  ]
}
```

---

## 💡 **Examples**

### **Upload CSV File**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('instructions', 'Clean and validate');

const response = await fetch('http://localhost:8000/v1/upload/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const result = await response.json();
console.log(result);
```

### **Upload Image**
```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:8000/v1/upload/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 🎯 **Use Cases**

### **1. Data Cleaning**
Upload CSV/Excel files for AI-powered cleaning

### **2. Document Analysis**
Upload PDFs for content extraction and analysis

### **3. Image Processing**
Upload images for vision AI analysis

### **4. Code Review**
Upload code files for AI review and suggestions

### **5. Log Analysis**
Upload log files for pattern detection

---

## ✅ **Testing**

### **Test File Upload**
1. Go to http://localhost:3000/playground
2. Switch to "File" mode
3. Upload a test CSV file
4. Click "Run Workflow"
5. See the results!

### **Test API Endpoint**
```bash
# Create a test file
echo "name,email
John Doe,john@example.com" > test.csv

# Upload it
curl -X POST "http://localhost:8000/v1/upload/upload" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.csv"
```

---

## 🔒 **Security**

- ✅ File type validation
- ✅ File size limits
- ✅ Authentication required
- ✅ Virus scanning (coming soon)
- ✅ Secure file storage

---

## 📚 **Next Steps**

1. **Try it**: Go to http://localhost:3000/playground
2. **Upload a file**: Switch to File mode
3. **Process it**: Click Run Workflow
4. **See results**: View cleaned output

---

**File upload is now live! Test it in the playground!** 🎉
