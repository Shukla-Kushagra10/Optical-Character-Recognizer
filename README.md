##Optical Character Recognition in Python 

####Built a simple OCR system using Artificial Neural Networks to accurately recognize and classify numerical digits.


To keep things simple, I designed it so users could draw a single digit, then either train the system with that digit or ask it to predict what the digit is.
Although an OCR system could run locally, I chose a client–server setup for flexibility. This approach allows crowd-sourced training of the neural network and lets powerful servers handle the heavy computation.
My system consists of five main components, each in its own file:
 * Client (ocr.js) – handles communication between the user interface and the server.
 * Server (server.py) – routes requests and makes API calls to the ANN module.
 * User Interface (ocr.html) – provides a simple canvas for drawing digits and buttons for training or prediction.
 * ANN Module (ocr.py) – trains the network using backpropagation, saves weights, and reloads them on startup.
 * Design Script (neural_network_design.py) – helps me experiment with different hidden node counts to find the best configuration.
Here’s how it all works together: the user draws a digit on the canvas, the client converts that drawing into an array, and sends it to the server. The server then passes it to the ANN module, which either trains the model or predicts the digit. The ANN is trained initially on an existing dataset, and its weights are saved for reuse.
Altogether, these components form a simple but functional OCR system that can learn from user input and make predictions efficiently.
Would you like me to show how the client and server communicate—perhaps with a sample API flow or code snippet?
