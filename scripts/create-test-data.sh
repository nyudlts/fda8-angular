#!/bin/bash
# scripts/create-test-data.sh

set -e

DSPACE_REST_URL=${DSPACE_REST_URL:-http://localhost:8080/server}
DSPACE_ADMIN_EMAIL=${DSPACE_ADMIN_EMAIL:-dspacedemo+admin@gmail.com}
DSPACE_ADMIN_PASS=${DSPACE_ADMIN_PASS:-dspace}

echo "DSpace REST API: $DSPACE_REST_URL"

# Wait for DSpace to be ready
echo "Waiting for DSpace API..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
  if curl -s "${DSPACE_REST_URL}/api" > /dev/null 2>&1; then
    echo "DSpace is ready!"
    break
  fi
  attempt=$((attempt + 1))
  echo "Attempt $attempt/$max_attempts..."
  sleep 10
done

# Clean up old cookies
rm -f /tmp/dspace-cookies.txt

# Login and get auth token
echo "Authenticating..."

# Step 1: Get CSRF token
echo "Getting CSRF token..."
curl -s "${DSPACE_REST_URL}/api/authn/status" \
  -c /tmp/dspace-cookies.txt \
  > /dev/null

CSRF_TOKEN=$(grep "DSPACE-XSRF-COOKIE" /tmp/dspace-cookies.txt | awk '{print $NF}')

if [ -z "$CSRF_TOKEN" ]; then
  echo "❌ Failed to get CSRF token"
  exit 1
fi

echo "CSRF Token: ${CSRF_TOKEN:0:20}..."

# Step 2: Login with URL-encoded credentials
echo "Logging in as $DSPACE_ADMIN_EMAIL..."

LOGIN_RESPONSE=$(curl -s -i -X POST "${DSPACE_REST_URL}/api/authn/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-XSRF-TOKEN: ${CSRF_TOKEN}" \
  -b /tmp/dspace-cookies.txt \
  -c /tmp/dspace-cookies.txt \
  --data-urlencode "user=${DSPACE_ADMIN_EMAIL}" \
  --data-urlencode "password=${DSPACE_ADMIN_PASS}")

# Check login status
if echo "$LOGIN_RESPONSE" | grep -q "HTTP/1.1 200"; then
  echo "✅ Login successful"
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE" | head -20
  exit 1
fi

# Extract authorization token (the full value including "Bearer")
AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -i "^Authorization:" | sed 's/Authorization: //' | tr -d '\r\n')

if [ -z "$AUTH_TOKEN" ]; then
  echo "❌ Failed to get authorization token"
  echo "Headers:"
  echo "$LOGIN_RESPONSE" | grep -i "authorization"
  exit 1
fi

echo "✅ Authenticated"
echo "Auth Token: ${AUTH_TOKEN:0:40}..."

# Function to get current CSRF token
get_current_csrf() {
  grep "DSPACE-XSRF-COOKIE" /tmp/dspace-cookies.txt | awk '{print $NF}'
}

# Function to make authenticated API requests
api_request() {
  local method=$1
  local endpoint=$2
  local data=$3

  local csrf=$(get_current_csrf)

  if [ -z "$csrf" ]; then
    echo "❌ No CSRF token" >&2
    return 1
  fi

  # Debug: Show what we're sending
  echo "DEBUG: Making request to ${endpoint}" >&2
  echo "DEBUG: Auth token starts with: ${AUTH_TOKEN:0:30}..." >&2
  echo "DEBUG: CSRF token: ${csrf:0:20}..." >&2

  local temp_file=$(mktemp)
  local headers_file=$(mktemp)
  local http_code

  if [ -n "$data" ]; then
    http_code=$(curl -s -w "%{http_code}" -o "$temp_file" -D "$headers_file" \
      -X "$method" "${DSPACE_REST_URL}${endpoint}" \
      -H "Content-Type: application/json" \
      -H "Authorization: ${AUTH_TOKEN}" \
      -H "X-XSRF-TOKEN: ${csrf}" \
      -b /tmp/dspace-cookies.txt \
      -c /tmp/dspace-cookies.txt \
      -d "$data")
  else
    http_code=$(curl -s -w "%{http_code}" -o "$temp_file" -D "$headers_file" \
      -X "$method" "${DSPACE_REST_URL}${endpoint}" \
      -H "Authorization: ${AUTH_TOKEN}" \
      -H "X-XSRF-TOKEN: ${csrf}" \
      -b /tmp/dspace-cookies.txt \
      -c /tmp/dspace-cookies.txt)
  fi

  local response=$(cat "$temp_file")
  rm "$temp_file"

  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    rm "$headers_file"
    echo "$response"
    return 0
  else
    echo "❌ HTTP $http_code" >&2
    echo "Response: $response" >&2
    echo "Response headers:" >&2
    cat "$headers_file" >&2
    rm "$headers_file"
    return 1
  fi
}

# Test authentication first
echo ""
echo "=== Testing Authentication ==="
TEST_AUTH=$(api_request GET "/api/authn/status")
if [ $? -eq 0 ]; then
  echo "✅ Authentication verified"
  echo "User info: $(echo "$TEST_AUTH" | jq -r '.email // "unknown"')"
else
  echo "❌ Authentication test failed"
  exit 1
fi

# Create test community
echo ""
echo "=== Creating Test Community ==="

COMMUNITY_RESPONSE=$(api_request POST "/api/core/communities" '{
  "name": "Test Community",
  "metadata": {
    "dc.title": [{"value": "Test Community for FDA Theme"}]
  }
}')

if [ $? -ne 0 ]; then
  echo "Failed to create community"
  exit 1
fi

COMMUNITY_UUID=$(echo "$COMMUNITY_RESPONSE" | jq -r '.uuid')
COMMUNITY_HANDLE=$(echo "$COMMUNITY_RESPONSE" | jq -r '.handle')

if [ -z "$COMMUNITY_UUID" ] || [ "$COMMUNITY_UUID" = "null" ]; then
  echo "❌ Failed to extract community UUID"
  echo "Response: $COMMUNITY_RESPONSE"
  exit 1
fi

echo "✅ Community created"
echo "UUID: $COMMUNITY_UUID"
echo "Handle: $COMMUNITY_HANDLE"

# Function to create a collection
create_collection() {
  local name=$1
  local community_uuid=$2

  echo "Creating $name..."

  local response=$(api_request POST "/api/core/collections?parent=${community_uuid}" '{
    "name": "'"$name"'",
    "metadata": {
      "dc.title": [{"value": "'"$name"'"}]
    }
  }')

  if [ $? -ne 0 ]; then
    return 1
  fi

  local uuid=$(echo "$response" | jq -r '.uuid')
  local handle=$(echo "$response" | jq -r '.handle')

  echo "✅ Created (UUID: $uuid, Handle: $handle)"
  echo "$uuid|$handle"
}

# Create collections
echo ""
echo "=== Creating Collections ==="

DEFAULT_RESULT=$(create_collection "Default Test Collection" "$COMMUNITY_UUID")
DEFAULT_COLLECTION_UUID=$(echo "$DEFAULT_RESULT" | cut -d'|' -f1)
DEFAULT_COLLECTION_HANDLE=$(echo "$DEFAULT_RESULT" | cut -d'|' -f2)

JONES_RESULT=$(create_collection "Jones Test Collection" "$COMMUNITY_UUID")
JONES_COLLECTION_UUID=$(echo "$JONES_RESULT" | cut -d'|' -f1)
JONES_COLLECTION_HANDLE=$(echo "$JONES_RESULT" | cut -d'|' -f2)

RELICS_RESULT=$(create_collection "Relics Test Collection" "$COMMUNITY_UUID")
RELICS_COLLECTION_UUID=$(echo "$RELICS_RESULT" | cut -d'|' -f1)
RELICS_COLLECTION_HANDLE=$(echo "$RELICS_RESULT" | cut -d'|' -f2)

LAEFER_RESULT=$(create_collection "Laefer Test Collection" "$COMMUNITY_UUID")
LAEFER_COLLECTION_UUID=$(echo "$LAEFER_RESULT" | cut -d'|' -f1)
LAEFER_COLLECTION_HANDLE=$(echo "$LAEFER_RESULT" | cut -d'|' -f2)

TANDON_RESULT=$(create_collection "Tandon Test Collection" "$COMMUNITY_UUID")
TANDON_COLLECTION_UUID=$(echo "$TANDON_RESULT" | cut -d'|' -f1)
TANDON_COLLECTION_HANDLE=$(echo "$TANDON_RESULT" | cut -d'|' -f2)

TANDONCAPSTONE_RESULT=$(create_collection "Tandon Capstone Test Collection" "$COMMUNITY_UUID")
TANDONCAPSTONE_COLLECTION_UUID=$(echo "$TANDONCAPSTONE_RESULT" | cut -d'|' -f1)
TANDONCAPSTONE_COLLECTION_HANDLE=$(echo "$TANDONCAPSTONE_RESULT" | cut -d'|' -f2)

DNP_RESULT=$(create_collection "DNP Test Collection" "$COMMUNITY_UUID")
DNP_COLLECTION_UUID=$(echo "$DNP_RESULT" | cut -d'|' -f1)
DNP_COLLECTION_HANDLE=$(echo "$DNP_RESULT" | cut -d'|' -f2)

CALABASH_RESULT=$(create_collection "Calabash Test Collection" "$COMMUNITY_UUID")
CALABASH_COLLECTION_UUID=$(echo "$CALABASH_RESULT" | cut -d'|' -f1)
CALABASH_COLLECTION_HANDLE=$(echo "$CALABASH_RESULT" | cut -d'|' -f2)

OPENSCHOLARSHIP_RESULT=$(create_collection "OpenScholarship Test Collection" "$COMMUNITY_UUID")
OPENSCHOLARSHIP_COLLECTION_UUID=$(echo "$OPENSCHOLARSHIP_RESULT" | cut -d'|' -f1)
OPENSCHOLARSHIP_COLLECTION_HANDLE=$(echo "$OPENSCHOLARSHIP_RESULT" | cut -d'|' -f2)

SYLLABI_RESULT=$(create_collection "Syllabi Test Collection" "$COMMUNITY_UUID")
SYLLABI_COLLECTION_UUID=$(echo "$SYLLABI_RESULT" | cut -d'|' -f1)
SYLLABI_COLLECTION_HANDLE=$(echo "$SYLLABI_RESULT" | cut -d'|' -f2)

# Function to create an item
create_item() {
  local collection_uuid=$1
  local title=$2
  local author=$3

  echo "Creating $title..."

  local response=$(api_request POST "/api/core/items?owningCollection=${collection_uuid}" '{
    "name": "'"$title"'",
    "metadata": {
      "dc.title": [{"value": "'"$title"'"}],
      "dc.contributor.author": [{"value": "'"$author"'"}],
      "dc.description.abstract": [{"value": "Test abstract"}]
    },
    "inArchive": true,
    "discoverable": true
  }')

  if [ $? -ne 0 ]; then
    return 1
  fi

  local uuid=$(echo "$response" | jq -r '.uuid')
  echo "✅ Created (UUID: $uuid)"
  echo "$uuid"
}

# Create items
echo ""
echo "=== Creating Test Items ==="

DEFAULT_ITEM_UUID=$(create_item "$DEFAULT_COLLECTION_UUID" "Default Test Publication" "Test Author")
JONES_ITEM_UUID=$(create_item "$JONES_COLLECTION_UUID" "Jones Test Item" "Jones Author")
RELICS_ITEM_UUID=$(create_item "$RELICS_COLLECTION_UUID" "Relics Test Item" "Relics Author")
LAEFER_ITEM_UUID=$(create_item "$LAEFER_COLLECTION_UUID" "Laefer Test Publication" "Laefer Author")
TANDON_ITEM_UUID=$(create_item "$TANDON_COLLECTION_UUID" "Tandon Test Article" "Tandon Author")
TANDONCAPSTONE_ITEM_UUID=$(create_item "$TANDONCAPSTONE_COLLECTION_UUID" "Tandon Capstone Project" "Capstone Student")
DNP_ITEM_UUID=$(create_item "$DNP_COLLECTION_UUID" "DNP Test Thesis" "DNP Student")
CALABASH_ITEM_UUID=$(create_item "$CALABASH_COLLECTION_UUID" "Calabash Test Article" "Calabash Author")
OPENSCHOLARSHIP_ITEM_UUID=$(create_item "$OPENSCHOLARSHIP_COLLECTION_UUID" "OpenScholarship Test Paper" "Scholar")
SYLLABI_ITEM_UUID=$(create_item "$SYLLABI_COLLECTION_UUID" "Test Syllabus" "Test Instructor")

# Create cypress.env.json
cat > cypress.env.json << EOF
{
  "DSPACE_TEST_ENTITY_PUBLICATION": "$DEFAULT_ITEM_UUID",
  "DSPACE_TEST_JONES_ITEM": "$JONES_ITEM_UUID",
  "DSPACE_TEST_RELICS_ITEM": "$RELICS_ITEM_UUID",
  "DSPACE_TEST_LAEFER_ITEM": "$LAEFER_ITEM_UUID",
  "DSPACE_TEST_TANDON_ITEM": "$TANDON_ITEM_UUID",
  "DSPACE_TEST_TANDONCAPSTONE_ITEM": "$TANDONCAPSTONE_ITEM_UUID",
  "DSPACE_TEST_DNP_ITEM": "$DNP_ITEM_UUID",
  "DSPACE_TEST_CALABASH_ITEM": "$CALABASH_ITEM_UUID",
  "DSPACE_TEST_OPENSCHOLARSHIP_ITEM": "$OPENSCHOLARSHIP_ITEM_UUID",
  "DSPACE_TEST_SYLLABI_ITEM": "$SYLLABI_ITEM_UUID"
}
EOF

echo ""
echo "✅ Test data created successfully!"

if [ -n "$GITHUB_OUTPUT" ]; then
  {
    echo "default_item_uuid=$DEFAULT_ITEM_UUID"
    echo "jones_item_uuid=$JONES_ITEM_UUID"
    echo "relics_item_uuid=$RELICS_ITEM_UUID"
    echo "laefer_item_uuid=$LAEFER_ITEM_UUID"
    echo "tandon_item_uuid=$TANDON_ITEM_UUID"
    echo "tandoncapstone_item_uuid=$TANDONCAPSTONE_ITEM_UUID"
    echo "dnp_item_uuid=$DNP_ITEM_UUID"
    echo "calabash_item_uuid=$CALABASH_ITEM_UUID"
    echo "openscholarship_item_uuid=$OPENSCHOLARSHIP_ITEM_UUID"
    echo "syllabi_item_uuid=$SYLLABI_ITEM_UUID"
  } >> "$GITHUB_OUTPUT"
fi
