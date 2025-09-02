#!/bin/bash

# Comprehensive Test Suite for Wizbiz
# This script runs all tests and collects results

echo "==================================="
echo "Wizbiz Comprehensive Test Suite"
echo "==================================="
echo "Started at: $(date)"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Create results directory
RESULTS_DIR="test-results-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RESULTS_DIR"

# Function to run a test
run_test() {
    local TEST_NAME=$1
    local TEST_CMD=$2
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo ""
    echo "-----------------------------------"
    echo "Running: $TEST_NAME"
    echo "Command: $TEST_CMD"
    echo "-----------------------------------"
    
    # Run the test
    if $TEST_CMD > "$RESULTS_DIR/$TEST_NAME.log" 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}: $TEST_NAME"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        
        # Copy test results
        cp -r test/test-logs/* "$RESULTS_DIR/" 2>/dev/null
    else
        echo -e "${RED}✗ FAILED${NC}: $TEST_NAME (exit code: $?)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        
        # Copy all logs for failed test
        cp -r test/test-logs/* "$RESULTS_DIR/" 2>/dev/null
        cp -r test/crash-dumps/* "$RESULTS_DIR/" 2>/dev/null
    fi
    
    # Clean up for next test
    rm -rf test/test-logs/*
    rm -rf test/crash-dumps/*
}

# Pre-test setup
echo "Setting up test environment..."
npm install --silent

# Create test directories
mkdir -p test/test-logs
mkdir -p test/crash-dumps

# Test 1: Basic Original Version
run_test "basic-original" "npm run test:basic"

# Test 2: Modular Version
run_test "modular-standard" "npm run test:modular"

# Test 3: Modular Fixed Version
run_test "modular-fixed" "npm run test:modular-fixed"

# Test 4: Stress Test Original
run_test "stress-original" "npm run test:stress"

# Test 5: Stress Test Fixed
run_test "stress-fixed" "cross-env USE_FIXED=true npm run test:stress"

# Test 6: Memory Test (2 minutes)
run_test "memory-test" "cross-env TEST_DURATION=120000 npm run test:modular-fixed"

# Test 7: High Density Test
run_test "high-density" "cross-env ENEMY_DENSITY=swarm USE_FIXED=true npm run test:modular"

# Generate summary report
echo ""
echo "==================================="
echo "TEST SUMMARY"
echo "==================================="
echo "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo "Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
echo ""
echo "Results saved to: $RESULTS_DIR"
echo "Completed at: $(date)"

# Create summary file
cat > "$RESULTS_DIR/SUMMARY.txt" << EOF
Wizbiz Test Summary
===================
Date: $(date)
Total Tests: $TOTAL_TESTS
Passed: $PASSED_TESTS
Failed: $FAILED_TESTS
Success Rate: $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%

Test Results:
EOF

# Add individual test results to summary
for log in "$RESULTS_DIR"/*.log; do
    if [ -f "$log" ]; then
        TEST_NAME=$(basename "$log" .log)
        if grep -q "Test completed.*passed: true" "$log"; then
            echo "✓ $TEST_NAME: PASSED" >> "$RESULTS_DIR/SUMMARY.txt"
        else
            echo "✗ $TEST_NAME: FAILED" >> "$RESULTS_DIR/SUMMARY.txt"
        fi
    fi
done

# Exit with failure if any tests failed
if [ $FAILED_TESTS -gt 0 ]; then
    exit 1
else
    exit 0
fi