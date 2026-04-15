import json
from http.server import SimpleHTTPRequestHandler, HTTPServer
from ocr import OCRNeuralNetwork

# Setup the Network
nn = OCRNeuralNetwork(15)

class OCRHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data)

        response = {}
        if payload.get('train'):
            nn.train(payload['trainArray'])
            nn.save()
            print("Trained on a new batch.")
        elif payload.get('predict'):
            prediction = nn.predict(json.dumps(payload['image']))
            response = {"type": "test", "result": prediction}
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), OCRHandler)
    print("Server started at http://localhost:8000")
    server.serve_forever()