# Document Sign

A full-stack document signing application built with Django (backend) and React (frontend).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python** (3.8 or higher)
- **Node.js** (14.x or higher)
- **npm** (6.x or higher)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/nundudid/document-sign
cd document-sign
```

## Running the Application

### Backend Setup

1. **Navigate to the backend folder:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv .venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     .venv\Scripts\activate
     ```
   - **Linux/macOS:**
     ```bash
     source .venv/bin/activate
     ```

4. **Install required dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run database migrations:**

   ```bash
   python api/manage.py migrate
   ```

6. **Start the Django development server:**
   ```bash
   python api/manage.py runserver
   ```

The backend server should now be running at `http://localhost:8000`

### Frontend Setup

1. **Open a new terminal window/tab**

2. **Navigate to the frontend folder:**

   ```bash
   cd document-sign/frontend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the React development server:**

   ```bash
   npm start
   ```

5. **Access the application:**

   The application will automatically open in your default browser at `http://localhost:3000`

   If it doesn't open automatically, manually navigate to `http://localhost:3000`

## Usage

Once both servers are running:

1. Open your browser and go to `http://localhost:3000`
2. The frontend will communicate with the backend API running on `http://localhost:8000`
3. You can now use the document signing features of the application

## API Documentation

### Base URL

```
http://localhost:8000/api/
```

### Endpoints

#### 1. Create New Document

**POST** `/api/bitrix/documents/`

Creates a new document with sender and receiver information, uploads a PDF file, and generates a unique token.

**Request Body** (form-data):

| Parameter    | Type   | Required | Description                                          |
| ------------ | ------ | -------- | ---------------------------------------------------- |
| sender_iin   | string | Yes      | 12-digit sender's Individual Identification Number   |
| receiver_iin | string | Yes      | 12-digit receiver's Individual Identification Number |
| file         | file   | Yes      | PDF file to upload (only .pdf format accepted)       |

**Validation:**

- Only PDF files are accepted
- Both IINs must be 12 digits

**Response** (201 Created):

```json
{
  "token": "19ee3adc-6276-489c-ba8d-cdae1eff1fad",
  "sender_iin": "123456789012",
  "receiver_iin": "987654321098",
  "status": "pending",
  "sign_url": "http://localhost:3000/sign/19ee3adc-6276-489c-ba8d-cdae1eff1fad",
  "created_at": "2023-10-01T10:30:00Z"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid file format or missing required fields
- `415 Unsupported Media Type`: Non-PDF file uploaded

---

#### 2. Get Sent Documents

**GET** `/api/documents/sent/`

Retrieves all documents sent by a specific sender IIN.

**Query Parameters:**

| Parameter  | Type   | Required | Description                               |
| ---------- | ------ | -------- | ----------------------------------------- |
| sender_iin | string | Yes      | 12-digit sender's IIN to filter documents |

**Example Request:**

```
GET /api/documents/sent/?sender_iin=123456789012
```

**Response** (200 OK):

```json
[
  {
    "token": "19ee3adc-6276-489c-ba8d-cdae1eff1fad",
    "sender_iin": "123456789012",
    "receiver_iin": "987654321098",
    "status": "pending",
    "file_url": "http://localhost:8000/media/pdfs/19ee3adc-6276-489c-ba8d-cdae1eff1fad.pdf",
    "created_at": "2023-10-01T10:30:00Z"
  },
  {
    "token": "28ff4bde-7387-5a9d-cb9e-ddbf2fee2gbe",
    "sender_iin": "123456789012",
    "receiver_iin": "555555555555",
    "status": "accepted",
    "file_url": "http://localhost:8000/media/pdfs/28ff4bde-7387-5a9d-cb9e-ddbf2fee2gbe.pdf",
    "created_at": "2023-10-02T14:20:00Z"
  }
]
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid sender_iin parameter
- `404 Not Found`: No documents found for the given sender_iin

---

#### 3. Get Received Documents

**GET** `/api/documents/received/`

Retrieves all documents received by a specific receiver IIN.

**Query Parameters:**

| Parameter    | Type   | Required | Description                                 |
| ------------ | ------ | -------- | ------------------------------------------- |
| receiver_iin | string | Yes      | 12-digit receiver's IIN to filter documents |

**Example Request:**

```
GET /api/documents/received/?receiver_iin=987654321098
```

**Response** (200 OK):

```json
[
  {
    "token": "19ee3adc-6276-489c-ba8d-cdae1eff1fad",
    "sender_iin": "123456789012",
    "receiver_iin": "987654321098",
    "status": "pending",
    "file_url": "http://localhost:8000/media/pdfs/19ee3adc-6276-489c-ba8d-cdae1eff1fad.pdf",
    "created_at": "2023-10-01T10:30:00Z"
  }
]
```

**Error Responses:**

- `400 Bad Request`: Missing or invalid receiver_iin parameter
- `404 Not Found`: No documents found for the given receiver_iin

---

#### 4. Get PDF File URL

**GET** `/api/documents/{token}/file/`

Returns the URL of the PDF file associated with a specific document token.

**URL Parameters:**

| Parameter | Type | Required | Description                |
| --------- | ---- | -------- | -------------------------- |
| token     | UUID | Yes      | Unique document identifier |

**Example Request:**

```
GET /api/documents/19ee3adc-6276-489c-ba8d-cdae1eff1fad/file/
```

**Response** (200 OK):

```json
{
  "file_url": "http://localhost:8000/media/pdfs/19ee3adc-6276-489c-ba8d-cdae1eff1fad.pdf"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid token format
- `404 Not Found`: Document with the given token not found

---

#### 5. Make Decision on Document

**POST** `/api/documents/{token}/decision/`

Accepts or rejects a document. Only pending documents can have their status changed.

**URL Parameters:**

| Parameter | Type | Required | Description                |
| --------- | ---- | -------- | -------------------------- |
| token     | UUID | Yes      | Unique document identifier |

**Request Body** (JSON):

```json
{
  "status": "accepted"
}
```

or

```json
{
  "status": "rejected"
}
```

**Example Request:**

```
POST /api/documents/19ee3adc-6276-489c-ba8d-cdae1eff1fad/decision/
Content-Type: application/json

{
    "status": "accepted"
}
```

**Response** (200 OK):

```json
{
  "status": "accepted"
}
```

**Error Responses:**

- `400 Bad Request`: Invalid status value or missing status field
- `404 Not Found`: Document with the given token not found
- `409 Conflict`: Document already has a final status (accepted/rejected)
- `400 Bad Request`: Invalid token format

---

### Document Status Values

| Status   | Description                            |
| -------- | -------------------------------------- |
| pending  | Document awaiting receiver's decision  |
| accepted | Document has been accepted by receiver |
| rejected | Document has been rejected by receiver |

## Project Structure

```
document-sign/
├── backend/
│   ├── api/
│   │   └── manage.py
│   ├── requirements.txt
│   └── .venv/
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── node_modules/
```
