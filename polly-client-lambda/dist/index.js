"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
class Program {
    main(event) {
        console.log('Hello World!');
        const response = 'Hello World!' + JSON.stringify(event, null, 2);
        return response;
    }
}
exports.Program = Program;
class PollyClient {
    synth() {
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
        polly.synthesizeSpeech(params, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else
                console.log(data); // successful response
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
exports.PollyClient = PollyClient;
exports.handler = async (event = {}) => {
    const prog = new Program();
    prog.main(event);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDN0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztBQUd6QyxNQUFhLE9BQU87SUFDWCxJQUFJLENBQUMsS0FBVTtRQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sUUFBUSxHQUFHLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakUsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBTkQsMEJBTUM7QUFFRCxNQUFhLFdBQVc7SUFDZixLQUFLO1FBQ1YsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFeEQsSUFBSSxNQUFNLEdBQUc7WUFDWCxrQkFBa0I7WUFDbEIsZUFBZTtZQUNmLEtBQUs7WUFDTCxZQUFZLEVBQUUsS0FBSztZQUNuQixVQUFVLEVBQUUsTUFBTTtZQUNsQixJQUFJLEVBQUUsZ0NBQWdDO1lBQ3RDLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE9BQU8sRUFBRSxRQUFRO1NBQ2xCLENBQUM7UUFDRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQVUsR0FBUSxFQUFFLElBQVM7WUFDMUQsSUFBSSxHQUFHO2dCQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjs7Z0JBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVyxzQkFBc0I7WUFDeEQ7Ozs7OztjQU1FO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExQkQsa0NBMEJDO0FBRUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsUUFBYSxFQUFFLEVBQWdCLEVBQUU7SUFDeEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQSJ9