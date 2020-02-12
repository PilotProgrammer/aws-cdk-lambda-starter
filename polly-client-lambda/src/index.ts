var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});


export class Program {
  public main(event: any) {
    console.log('Hello World!');
    const response = 'Hello World!' + JSON.stringify(event, null, 2);
    return response;
  }
}

export class PollyClient {
  public synth() {
    var polly = new AWS.Polly({ apiVersion: '2016-06-10' });

    var params = {
      // LexiconNames: [
      //   "example1"
      // ],
      OutputFormat: "mp3",
      SampleRate: "8000",
      Text: "All your base are belong to us",
      TextType: "text",
      VoiceId: "Joanna"
    };
    polly.synthesizeSpeech(params, function (err: any, data: any) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
      /*
      data = {
       AudioStream: <Binary String>, 
       ContentType: "audio/mpeg", 
       RequestCharacters: 37
      }
      */
    });
  }
}

exports.handler = async (event: any = {}): Promise<any> => {
  const prog = new Program();
  prog.main(event);
}


