# Optical Character Recognition (OCR) in Python

A simple OCR system built using **Artificial Neural Networks (ANNs)** to recognize and classify numerical digits.  
Users can draw a single digit, then either train the system with that digit or ask it to predict what the digit is.

To keep things flexible, the system uses a **client–server architecture**. This setup allows:
- Crowd-sourced training of the neural network
- Heavy computation to be handled by powerful servers
- Lightweight clients that can run locally in a browser

---

## 🚀 Features
- Draw digits on a canvas and send them to the server
- Train the ANN with user-provided digits
- Predict digits using a trained ANN
- Save and reload ANN weights for reuse
- Experiment with different hidden node configurations

---

## 🛠️ System Components
The project is organized into five main files:

1. **Client (`ocr.js`)**  
   Handles communication between the user interface and the server.

2. **Server (`server.py`)**  
   Routes requests and makes API calls to the ANN module.

3. **User Interface (`ocr.html`)**  
   Provides a simple canvas for drawing digits and buttons for training or prediction.

4. **ANN Module (`ocr.py`)**  
   - Trains the network using backpropagation  
   - Saves weights for reuse  
   - Reloads weights on startup

5. **Design Script (`neural_network_design.py`)**  
   Helps experiment with different hidden node counts to find the best configuration.

---

## ⚙️ How It Works
1. The user draws a digit on the canvas (`ocr.html`).
2. The client (`ocr.js`) converts the drawing into an array and sends it to the server.
3. The server (`server.py`) passes the array to the ANN module (`ocr.py`).
4. The ANN either:
   - **Trains** on the new digit, updating its weights, or  
   - **Predicts** the digit using existing weights.
5. The ANN is initially trained on an existing dataset, and its weights are saved for reuse.

---

## 📂 Project Structure
├── ocr.html                # User interface (digit drawing canvas)
├── ocr.js                  # Client-side communication
├── server.py               # Server-side routing and API handling
├── ocr.py                  # ANN module (training & prediction)
├── neural_network_design.py # Experimentation with ANN design

Code

---

## 🧠 ANN Details
- Implemented using Python
- Backpropagation for training
- Configurable hidden nodes
- Weight persistence for efficient reuse

---

## 🔮 Future Improvements
- Extend recognition to alphabets and symbols
- Add support for multiple digits at once
- Improve accuracy with convolutional neural networks (CNNs)
- Deploy as a web service with real-time feedback

---

## 📜 License
This project is licensed under the MIT License.  
Feel free to use, modify, and distribute.
