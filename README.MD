# logi-logger
A TypeScript-based logger for Node.js applications that automatically logs messages to Google Cloud Storage, organized by API routes. It offers seamless integration with Express.js, automatically determining the API route for logging. The primary feature is its ability to store logs in cloud storage with a directory structure that mirrors the API route. As of now, it supports Google Cloud Storage (GCS), with potential future support for other cloud storage platforms.

## Features
1. Seamless integration with Express.js.
2. Automatically determines the API route for logging.
3. Stores logs in Google Cloud Storage with a directory structure matching the API route.
4. Easy setup and minimal configuration

Prerequisites
1. A Google Cloud Platform account.
2. A Google Cloud Storage bucket.
3. A service account with permissions to write to the GCS bucket. Download the JSON key for this service account.

## Installation
```
npm i logi-logger
```

### Initialization

Before using the logger, initialize it with your GCS bucket details:

```typescript
import { logilogger } from 'logi-logger';

logger.initialize('YOUR_BUCKET_NAME', 'PATH_TO_SERVICE_ACCOUNT_JSON');
```

### Middleware Setup
To enable the logger to automatically determine the API route, integrate the provided middleware:
```typescript
import { setCurrentRoute } from 'logi-logger';
import express from 'express';

const app = express();

app.use(setCurrentRoute);
```

### Logging
Post setup, log messages in your routes without specifying the route:
```
app.get('/some/route', (req, res) => {
    logilogger.log("This is a log message");
    // Rest of your route logic
});
```

### Configuration
The logger employs the default console.log method for console logging. For custom logging methods or overrides, consider extending the LogicalLogger class.

### Contributing
Pull requests are welcome. For significant changes, kindly open an issue first to discuss the proposed change.