const fs = require('fs');
const path = require('path');

console.log('🔍 Systematically checking bundle for issues...\n');

const bundle = fs.readFileSync('dist/game-bundle.js', 'utf8');
const lines = bundle.split('\n');
let issues = [];
let warnings = [];

// 1. Check for undefined references
console.log('1️⃣ Checking for undefined references...');
const classExtends = bundle.match(/class\s+(\w+)\s+extends\s+(\w+)/g) || [];
const definedClasses = new Set(bundle.match(/class\s+(\w+)/g)?.map(c => c.replace('class ', '')) || []);

classExtends.forEach(match => {
    const [, childClass, parentClass] = match.match(/class\s+(\w+)\s+extends\s+(\w+)/);
    if (!definedClasses.has(parentClass) && parentClass !== 'Phaser') {
        issues.push(`❌ Class '${childClass}' extends undefined '${parentClass}'`);
    }
});

// 2. Check for duplicate declarations
console.log('2️⃣ Checking for duplicate declarations...');
const declarations = {};
['const', 'let', 'var', 'class', 'function'].forEach(type => {
    const regex = new RegExp(`^${type}\\s+(\\w+)`, 'gm');
    const matches = bundle.match(regex) || [];
    matches.forEach(match => {
        const name = match.replace(new RegExp(`^${type}\\s+`), '').split(/[\s=({]/)[0];
        if (!declarations[name]) declarations[name] = [];
        declarations[name].push(type);
    });
});

Object.entries(declarations).forEach(([name, types]) => {
    if (types.length > 1 && !name.startsWith('_')) {
        issues.push(`❌ '${name}' declared ${types.length} times as: ${types.join(', ')}`);
    }
});

// 3. Check for missing common functions
console.log('3️⃣ Checking for required functions...');
const requiredFunctions = [
    'setupFullscreenKey',
    'debugLog',
    'debugWarn',
    'debugError',
    'lerp',
    'clamp',
    'formatTime'
];

requiredFunctions.forEach(func => {
    if (!bundle.includes(`function ${func}`) && !bundle.includes(`${func} =`)) {
        issues.push(`❌ Missing required function: ${func}`);
    }
});

// 4. Check for calls to undefined functions
console.log('4️⃣ Checking for calls to undefined functions...');
const functionCalls = bundle.match(/\b(\w+)\s*\(/g) || [];
const definedFunctions = new Set([
    ...bundle.match(/function\s+(\w+)/g)?.map(f => f.replace('function ', '')) || [],
    ...bundle.match(/(\w+)\s*=\s*function/g)?.map(f => f.split('=')[0].trim()) || [],
    ...bundle.match(/(\w+)\s*=\s*\([^)]*\)\s*=>/g)?.map(f => f.split('=')[0].trim()) || []
]);

// Add known browser/Phaser functions
const knownGlobals = new Set([
    'console', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval',
    'localStorage', 'Math', 'Date', 'Array', 'Object', 'String', 'Number',
    'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'alert', 'confirm',
    'require', 'module', 'exports', 'process', 'eval', 'window', 'document',
    'super', 'this', 'new', 'typeof', 'instanceof', 'if', 'else', 'for',
    'while', 'do', 'switch', 'case', 'break', 'continue', 'return', 'try',
    'catch', 'finally', 'throw', 'getStageDisplayName', 'HTMLElement'
]);

const undefinedCalls = new Set();
functionCalls.forEach(call => {
    const funcName = call.replace(/\s*\(/, '');
    if (!definedFunctions.has(funcName) && 
        !definedClasses.has(funcName) && 
        !knownGlobals.has(funcName) &&
        !funcName.startsWith('get') &&
        !funcName.startsWith('set') &&
        !funcName.startsWith('on') &&
        !funcName.startsWith('add') &&
        !funcName.startsWith('remove') &&
        !funcName.startsWith('update') &&
        !funcName.startsWith('create') &&
        !funcName.startsWith('preload') &&
        !funcName.startsWith('init') &&
        !funcName.includes('.')) {
        undefinedCalls.add(funcName);
    }
});

undefinedCalls.forEach(func => {
    if (bundle.includes(`${func}(`)) {
        warnings.push(`⚠️ Possibly undefined function called: ${func}`);
    }
});

// 5. Check import/export statements
console.log('5️⃣ Checking for import/export statements...');
if (bundle.includes('import ')) {
    issues.push('❌ Bundle contains import statements');
}
if (bundle.includes('export ')) {
    const exports = bundle.match(/export\s+/g);
    if (exports) {
        issues.push(`❌ Bundle contains ${exports.length} export statements`);
    }
}

// 6. Check for syntax patterns that might cause issues
console.log('6️⃣ Checking for problematic patterns...');
if (bundle.includes('require(')) {
    warnings.push('⚠️ Bundle contains require() calls (only works in Node/Electron)');
}

// 7. Check for asset path issues
console.log('7️⃣ Checking asset paths...');
const assetPaths = bundle.match(/['"]([^'"]*\.(png|jpg|jpeg|gif|mp3|ogg|wav|json))['"]/gi) || [];
const problematicPaths = assetPaths.filter(p => {
    const path = p.slice(1, -1);
    return path.includes('\\') || path.includes('//') || path.startsWith('/');
});
if (problematicPaths.length > 0) {
    warnings.push(`⚠️ Found ${problematicPaths.length} potentially problematic asset paths`);
}

// 8. Check scenes are properly defined
console.log('8️⃣ Checking scene classes...');
const requiredScenes = [
    'LoadingScene',
    'TitleScene',
    'StageSelectScene',
    'GameSceneModular',
    'GameOverScene'
];

requiredScenes.forEach(scene => {
    if (!definedClasses.has(scene)) {
        issues.push(`❌ Missing required scene: ${scene}`);
    }
});

// 9. Check for circular dependencies or recursive issues
console.log('9️⃣ Checking for potential circular dependencies...');
const initCalls = bundle.match(/this\.(\w+)\s*=\s*new\s+(\w+)/g) || [];
const circularRisks = {};
initCalls.forEach(call => {
    const [, prop, className] = call.match(/this\.(\w+)\s*=\s*new\s+(\w+)/);
    if (!circularRisks[className]) circularRisks[className] = [];
    circularRisks[className].push(prop);
});

// Report results
console.log('\n' + '='.repeat(60));
console.log('📊 DIAGNOSTIC RESULTS:');
console.log('='.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
    console.log('✅ No issues found! Bundle appears to be stable.');
} else {
    if (issues.length > 0) {
        console.log(`\n🔴 CRITICAL ISSUES (${issues.length}):`);
        issues.forEach(issue => console.log(`  ${issue}`));
    }
    
    if (warnings.length > 0 && warnings.length <= 10) {
        console.log(`\n🟡 WARNINGS (${warnings.length}):`);
        warnings.forEach(warning => console.log(`  ${warning}`));
    } else if (warnings.length > 10) {
        console.log(`\n🟡 WARNINGS: ${warnings.length} potential issues found`);
        console.log('  (Showing first 10)');
        warnings.slice(0, 10).forEach(warning => console.log(`  ${warning}`));
    }
}

// Summary
console.log('\n📈 BUNDLE STATS:');
console.log(`  • Size: ${(bundle.length / 1024).toFixed(2)} KB`);
console.log(`  • Lines: ${lines.length}`);
console.log(`  • Classes defined: ${definedClasses.size}`);
console.log(`  • Functions defined: ${definedFunctions.size}`);
console.log(`  • Has IIFE wrapper: ${bundle.includes('(function()') ? 'Yes' : 'No'}`);
console.log(`  • Has game creation: ${bundle.includes('new Phaser.Game') ? 'Yes' : 'No'}`);

if (issues.length > 0) {
    console.log('\n❗ Action required: Fix critical issues before proceeding.');
    process.exit(1);
} else {
    console.log('\n✅ Bundle is ready for testing!');
    process.exit(0);
}