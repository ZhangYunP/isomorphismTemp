import stackTrace from 'stack-trace'

function getErrorInfo() {
  const callSite = stackTrace.get()[0]
  const filePath = callSite.getFileName()
  const typeName = callSite.getTypeName()
  const lineNumber = callSite.getLineNumber()
  const functionName = callSite.getFunctionName()
  return { filePath, typeName, lineNumber, functionName }
}

export default getErrorInfo
