#!/bin/bash

# Quick Test Suite for Wizbiz
# Runs basic tests to verify stability

echo "===================================="
echo "Wizbiz Quick Test Suite"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Run basic test
echo "1. Testing original game version..."
if npm run test:basic > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Original version: PASSED${NC}"
else
    echo -e "${RED}✗ Original version: FAILED${NC}"
fi

# Run modular test with cross-env
echo ""
echo "2. Testing modular version..."
if cross-env USE_MODULAR=true TEST_DURATION=20000 npm run test:headless > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Modular version: PASSED${NC}"
else
    echo -e "${RED}✗ Modular version: FAILED${NC}"
fi

# Run modular-fixed test
echo ""
echo "3. Testing modular-fixed version..."
if npm run test:modular-fixed > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Modular-fixed version: PASSED${NC}"
else
    echo -e "${RED}✗ Modular-fixed version: FAILED${NC}"
fi

echo ""
echo "Quick tests complete!"