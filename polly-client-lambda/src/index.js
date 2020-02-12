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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBR3pDLE1BQWEsT0FBTztJQUNYLElBQUksQ0FBQyxLQUFVO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUIsTUFBTSxRQUFRLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRSxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0NBQ0Y7QUFORCwwQkFNQztBQUVELE1BQWEsV0FBVztJQUNmLEtBQUs7UUFDVixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUV4RCxJQUFJLE1BQU0sR0FBRztZQUNYLGtCQUFrQjtZQUNsQixlQUFlO1lBQ2YsS0FBSztZQUNMLFlBQVksRUFBRSxLQUFLO1lBQ25CLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLElBQUksRUFBRSxnQ0FBZ0M7WUFDdEMsUUFBUSxFQUFFLE1BQU07WUFDaEIsT0FBTyxFQUFFLFFBQVE7U0FDbEIsQ0FBQztRQUNGLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBVSxHQUFRLEVBQUUsSUFBUztZQUMxRCxJQUFJLEdBQUc7Z0JBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsb0JBQW9COztnQkFDckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFXLHNCQUFzQjtZQUN4RDs7Ozs7O2NBTUU7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFCRCxrQ0EwQkM7QUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUN4RCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbkFXUy5jb25maWcudXBkYXRlKHtyZWdpb246ICd1cy1lYXN0LTEnfSk7XG5cblxuZXhwb3J0IGNsYXNzIFByb2dyYW0ge1xuICBwdWJsaWMgbWFpbihldmVudDogYW55KSB7XG4gICAgY29uc29sZS5sb2coJ0hlbGxvIFdvcmxkIScpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gJ0hlbGxvIFdvcmxkIScgKyBKU09OLnN0cmluZ2lmeShldmVudCwgbnVsbCwgMik7XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQb2xseUNsaWVudCB7XG4gIHB1YmxpYyBzeW50aCgpIHtcbiAgICB2YXIgcG9sbHkgPSBuZXcgQVdTLlBvbGx5KHsgYXBpVmVyc2lvbjogJzIwMTYtMDYtMTAnIH0pO1xuXG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIC8vIExleGljb25OYW1lczogW1xuICAgICAgLy8gICBcImV4YW1wbGUxXCJcbiAgICAgIC8vIF0sXG4gICAgICBPdXRwdXRGb3JtYXQ6IFwibXAzXCIsXG4gICAgICBTYW1wbGVSYXRlOiBcIjgwMDBcIixcbiAgICAgIFRleHQ6IFwiQWxsIHlvdXIgYmFzZSBhcmUgYmVsb25nIHRvIHVzXCIsXG4gICAgICBUZXh0VHlwZTogXCJ0ZXh0XCIsXG4gICAgICBWb2ljZUlkOiBcIkpvYW5uYVwiXG4gICAgfTtcbiAgICBwb2xseS5zeW50aGVzaXplU3BlZWNoKHBhcmFtcywgZnVuY3Rpb24gKGVycjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICAgIGlmIChlcnIpIGNvbnNvbGUubG9nKGVyciwgZXJyLnN0YWNrKTsgLy8gYW4gZXJyb3Igb2NjdXJyZWRcbiAgICAgIGVsc2UgY29uc29sZS5sb2coZGF0YSk7ICAgICAgICAgICAvLyBzdWNjZXNzZnVsIHJlc3BvbnNlXG4gICAgICAvKlxuICAgICAgZGF0YSA9IHtcbiAgICAgICBBdWRpb1N0cmVhbTogPEJpbmFyeSBTdHJpbmc+LCBcbiAgICAgICBDb250ZW50VHlwZTogXCJhdWRpby9tcGVnXCIsIFxuICAgICAgIFJlcXVlc3RDaGFyYWN0ZXJzOiAzN1xuICAgICAgfVxuICAgICAgKi9cbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgcHJvZyA9IG5ldyBQcm9ncmFtKCk7XG4gIHByb2cubWFpbihldmVudCk7XG59XG5cblxuIl19