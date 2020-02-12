import { Program, PollyClient } from './index'

// const prog = new Program();
// const response = prog.main({ "testKey": "testValue" });
// console.log ('lambda response:', JSON.stringify(response))

const polly = new PollyClient()
polly.synth()
