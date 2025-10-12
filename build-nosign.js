const builder = require('electron-builder');

// Build configuration with signing completely disabled
builder.build({
  config: {
    appId: 'com.alex.wizbiz',
    productName: 'WizBiz',
    directories: {
      output: 'dist'
    },
    files: [
      '**/*',
      '!node_modules/**/*',
      '!dist/**/*',
      '!.git/**/*',
      '!.gitignore'
    ],
    win: {
      target: 'portable',
      sign: false,
      signAndEditExecutable: false,
      signDlls: false,
      forceCodeSigning: false,
      verifyUpdateCodeSignature: false,
      certificateFile: undefined,
      certificatePassword: undefined,
      certificateSubjectName: undefined,
      certificateSha1: undefined,
      signingHashAlgorithms: undefined,
      rfc3161TimeStampServer: undefined,
      timeStampServer: undefined
    },
    portable: {
      artifactName: 'WizBiz-Portable.exe'
    }
  }
})
.then(() => {
  console.log('Build completed successfully!');
})
.catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});