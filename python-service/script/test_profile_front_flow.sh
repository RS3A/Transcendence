#!/usr/bin/env bash
set -euo pipefail

PROFILE_API_URL="${PROFILE_API_URL:-http://localhost:8000/profile}"
MONGO_CONTAINER="${MONGO_CONTAINER:-mongodb}"
DB_NAME="${DB_NAME:-transcendence}"

PROFILE_ID="mock-front-$(date +%s)"
STACK_1="TypeScript"
STACK_2="React"
STACK_3="MongoDB"

post_response_file="$(mktemp)"
get_response_file="$(mktemp)"
trap 'rm -f "$post_response_file" "$get_response_file"' EXIT

echo "=== Mock Front -> Mongo Test ==="
echo "API: ${PROFILE_API_URL}"
echo "Mongo container: ${MONGO_CONTAINER}"
echo "Database: ${DB_NAME}"
echo "profile_id: ${PROFILE_ID}"
echo

echo "1) Sending request as frontend payload..."
post_status="$(curl -sS -o "$post_response_file" -w "%{http_code}" -X POST "$PROFILE_API_URL" \
  -H 'Content-Type: application/json' \
  -d "{\"profile_id\":\"${PROFILE_ID}\",\"stacks\":[\"${STACK_1}\",\"${STACK_2}\",\"${STACK_3}\"]}")"

if [[ "$post_status" != "200" ]]; then
  echo "FAIL: POST /profile returned HTTP ${post_status}"
  echo "Response:"
  cat "$post_response_file"
  echo
  echo "Tip: if this is 404, rebuild and restart python-service with latest code."
  exit 1
fi

cat "$post_response_file"
echo
echo

echo "2) Reading profile back from API..."
get_status="$(curl -sS -o "$get_response_file" -w "%{http_code}" "$PROFILE_API_URL/${PROFILE_ID}")"

if [[ "$get_status" != "200" ]]; then
  echo "FAIL: GET /profile/${PROFILE_ID} returned HTTP ${get_status}"
  echo "Response:"
  cat "$get_response_file"
  exit 1
fi

cat "$get_response_file"
echo

echo "3) Checking document directly in MongoDB..."
mongo_doc="$(docker exec "$MONGO_CONTAINER" mongosh --quiet "$DB_NAME" --eval "db.profiles.findOne({profile_id:\"${PROFILE_ID}\"},{_id:0})")"
echo "$mongo_doc"
echo

if [[ "$mongo_doc" == "null" ]]; then
  echo "FAIL: Document was not persisted in MongoDB."
  exit 1
fi

if ! grep -q "$PROFILE_ID" <<<"$mongo_doc"; then
  echo "FAIL: Persisted document does not contain expected profile_id."
  exit 1
fi

if ! grep -q "$STACK_1" <<<"$mongo_doc" || ! grep -q "$STACK_2" <<<"$mongo_doc" || ! grep -q "$STACK_3" <<<"$mongo_doc"; then
  echo "FAIL: Persisted document does not contain expected stacks."
  exit 1
fi

echo "PASS: Front-like request reached API and persisted into MongoDB."
