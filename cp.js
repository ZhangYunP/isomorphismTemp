var exec = require('child_process').exec

exec('python dell.py', function(err, stdout, stderr) {
  if(err) {
    console.log(err)
  }else{
    data= JSON.parse(stdout)
    console.log(data)
  }
})
