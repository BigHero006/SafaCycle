# SafaCycle API Advanced Testing Scenarios

## Automated Test Scripts for Postman

### 1. Authentication Flow Test

**Pre-request Script for Login:**

```javascript
// Clear any existing token
pm.environment.unset("auth_token");

// Generate unique test user data
const timestamp = Date.now();
pm.globals.set("test_username", "testuser_" + timestamp);
pm.globals.set("test_email", "test_" + timestamp + "@safacycle.com");
```

**Test Script for Login:**

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("token");

  // Store token for subsequent requests
  pm.environment.set("auth_token", jsonData.token);
  pm.environment.set("user_id", jsonData.user.id);
});

pm.test("User data is complete", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.user).to.have.property("username");
  pm.expect(jsonData.user).to.have.property("email");
  pm.expect(jsonData.user).to.have.property("total_points");
  pm.expect(jsonData.user).to.have.property("level");
});
```

### 2. Waste Scan Creation Test

**Test Script for Waste Scan Creation:**

```javascript
pm.test("Status code is 201", function () {
  pm.response.to.have.status(201);
});

pm.test("Scan created successfully", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("id");
  pm.expect(jsonData.points_awarded).to.be.above(0);

  // Store scan ID for cleanup
  pm.environment.set("last_scan_id", jsonData.id);
});

pm.test("Points calculation is correct", function () {
  var jsonData = pm.response.json();
  var expectedPoints = jsonData.quantity * 5; // Assuming 5 points per item
  pm.expect(jsonData.points_awarded).to.equal(expectedPoints);
});

pm.test("ML confidence bonus applied", function () {
  var jsonData = pm.response.json();
  if (jsonData.ml_confidence > 0.9) {
    pm.expect(jsonData.bonus_points).to.be.above(0);
  }
});
```

### 3. Data Validation Tests

**Test Script for User Statistics:**

```javascript
pm.test("Statistics structure is valid", function () {
  var jsonData = pm.response.json();

  // Required fields
  pm.expect(jsonData).to.have.property("total_scans");
  pm.expect(jsonData).to.have.property("total_points");
  pm.expect(jsonData).to.have.property("level");
  pm.expect(jsonData).to.have.property("category_breakdown");

  // Data types
  pm.expect(jsonData.total_scans).to.be.a("number");
  pm.expect(jsonData.total_points).to.be.a("number");
  pm.expect(jsonData.level).to.be.a("number");
  pm.expect(jsonData.category_breakdown).to.be.an("object");
});

pm.test("Points and level consistency", function () {
  var jsonData = pm.response.json();

  // Level should increase with points
  if (jsonData.total_points >= 100) {
    pm.expect(jsonData.level).to.be.at.least(2);
  }
});
```

### 4. MongoDB Integration Test

**Test Script for MongoDB Status:**

```javascript
pm.test("MongoDB connection is active", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.status).to.equal("connected");
  pm.expect(jsonData.message).to.include("MongoDB connection is active");
});

pm.test("Database info is provided", function () {
  var jsonData = pm.response.json();
  if (jsonData.database_info) {
    pm.expect(jsonData.database_info).to.have.property("database_name");
    pm.expect(jsonData.database_info).to.have.property("collections");
    pm.expect(jsonData.database_info).to.have.property("total_documents");
  }
});
```

### 5. Error Handling Tests

**Test Script for Unauthorized Access:**

```javascript
pm.test("Status code is 401", function () {
  pm.response.to.have.status(401);
});

pm.test("Error message is appropriate", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.detail).to.include("Authentication");
});
```

**Test Script for Invalid Data:**

```javascript
pm.test("Status code is 400", function () {
  pm.response.to.have.status(400);
});

pm.test("Validation errors are detailed", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.be.an("object");
  // Should contain field-specific errors
});
```

### 6. Performance Tests

**Test Script for Response Time:**

```javascript
pm.test("Response time is acceptable", function () {
  pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response size is reasonable", function () {
  pm.expect(pm.response.responseSize).to.be.below(100000); // 100KB limit
});
```

### 7. Sequential Test Flow

**Collection-level Pre-request Script:**

```javascript
// Set common headers
pm.request.headers.add({
  key: "Content-Type",
  value: "application/json",
});

// Add auth token if available
const authToken = pm.environment.get("auth_token");
if (authToken && authToken !== "your_token_here") {
  pm.request.headers.add({
    key: "Authorization",
    value: "Token " + authToken,
  });
}

// Log request details for debugging
console.log("Making request to:", pm.request.url.toString());
console.log("Method:", pm.request.method);
```

**Collection-level Test Script:**

```javascript
// Common tests for all requests
pm.test("Response has valid structure", function () {
  pm.response.to.be.json;
});

pm.test("No server errors", function () {
  pm.expect(pm.response.code).to.not.be.oneOf([500, 502, 503, 504]);
});

// Store response time for performance tracking
const responseTime = pm.response.responseTime;
pm.globals.set("last_response_time", responseTime);

// Log performance data
console.log("Response time:", responseTime + "ms");
console.log("Response size:", pm.response.responseSize + " bytes");
```

## Advanced Test Scenarios

### Scenario 1: Complete User Journey

1. **Register** new user → Store credentials
2. **Login** with credentials → Store auth token
3. **Get profile** → Verify user data
4. **Get categories** → Store category IDs
5. **Create scan** → Verify points awarded
6. **Check statistics** → Verify updated totals
7. **Check MongoDB** → Verify analytics saved

### Scenario 2: Bulk Operations Test

1. Create 10 waste scans in sequence
2. Verify each scan is saved correctly
3. Check that statistics are updated properly
4. Verify MongoDB analytics data

### Scenario 3: Concurrent Users Simulation

1. Create multiple users simultaneously
2. Have each user create waste scans
3. Verify no data conflicts
4. Check system performance under load

### Scenario 4: Data Integrity Test

1. Create scan with maximum values
2. Create scan with minimum values
3. Verify edge cases are handled
4. Check MongoDB data consistency

### Scenario 5: Error Recovery Test

1. Attempt invalid operations
2. Verify proper error responses
3. Check that system remains stable
4. Verify subsequent valid operations work

## Test Data Sets

### Valid Test Data

```javascript
const validUsers = [
  {
    username: "testuser1",
    email: "test1@safacycle.com",
    password: "SafaCycle@123",
  },
  {
    username: "testuser2",
    email: "test2@safacycle.com",
    password: "SafaCycle@456",
  },
];

const validScans = [
  {
    category: 1,
    quantity: 5,
    estimated_weight_grams: 125,
    ml_confidence: 0.95,
  },
  {
    category: 2,
    quantity: 3,
    estimated_weight_grams: 45,
    ml_confidence: 0.87,
  },
];
```

### Invalid Test Data

```javascript
const invalidScans = [
  {
    category: 999, // Non-existent category
    quantity: -5, // Negative quantity
  },
  {
    category: "invalid", // Wrong data type
    quantity: 0, // Zero quantity
  },
];
```

## Performance Benchmarks

### Expected Response Times

- Authentication: < 500ms
- Data retrieval: < 800ms
- Data creation: < 1000ms
- MongoDB operations: < 1200ms
- Dashboard queries: < 1500ms

### Load Test Criteria

- 50 concurrent users: All operations < 2s
- 100 concurrent users: All operations < 3s
- 1000 database records: Queries < 5s

## Monitoring and Alerts

### Key Metrics to Track

1. Response times for each endpoint
2. Error rates by endpoint
3. MongoDB connection status
4. Authentication success rate
5. Data consistency checks

### Alert Conditions

- Response time > 5 seconds
- Error rate > 5%
- MongoDB connection failures
- Authentication failures > 10%
