import numpy as np
import json
import os

class OCRNeuralNetwork:
    NN_FILE_PATH = 'neural_network.json'

    def __init__(self, num_hidden_nodes, data_matrix=None, data_labels=None, train_indices=None, use_file=True):
        self._use_file = use_file
        self.LEARNING_RATE = 0.1
        self.num_hidden_nodes = num_hidden_nodes
        
        if use_file and os.path.exists(self.NN_FILE_PATH):
            self._load()
        else:
            # Initialize weights with random values
            self.theta1 = np.random.uniform(-0.06, 0.06, (num_hidden_nodes, 400))
            self.theta2 = np.random.uniform(-0.06, 0.06, (10, num_hidden_nodes))
            self.input_layer_bias = np.random.uniform(-0.06, 0.06, (num_hidden_nodes, 1))
            self.hidden_layer_bias = np.random.uniform(-0.06, 0.06, (10, 1))

    def _sigmoid(self, z):
        return 1 / (1 + np.exp(-z))

    def _sigmoid_prime(self, z):
        return np.multiply(self._sigmoid(z), (1 - self._sigmoid(z)))

    def train(self, train_batch):
        for data in train_batch:
            # Forward Prop
            y0 = np.atleast_2d(data['y0']).T
            sum1 = np.dot(self.theta1, y0) + self.input_layer_bias
            y1 = self._sigmoid(sum1)
            sum2 = np.dot(self.theta2, y1) + self.hidden_layer_bias
            y2 = self._sigmoid(sum2)

            # Backprop
            actual_vals = np.zeros((10, 1))
            actual_vals[data['label']] = 1
            
            output_errors = actual_vals - y2
            hidden_errors = np.multiply(np.dot(self.theta2.T, output_errors), self._sigmoid_prime(sum1))

            # Update weights
            self.theta1 += self.LEARNING_RATE * np.dot(hidden_errors, y0.T)
            self.theta2 += self.LEARNING_RATE * np.dot(output_errors, y1.T)
            self.hidden_layer_bias += self.LEARNING_RATE * output_errors
            self.input_layer_bias += self.LEARNING_RATE * hidden_errors

    def predict(self, image_data):
        y0 = np.atleast_2d(json.loads(image_data)).T
        y1 = self._sigmoid(np.dot(self.theta1, y0) + self.input_layer_bias)
        y2 = self._sigmoid(np.dot(self.theta2, y1) + self.hidden_layer_bias)
        return int(np.argmax(y2))

    def save(self):
        with open(self.NN_FILE_PATH, 'w') as f:
            json.dump({
                "theta1": self.theta1.tolist(), "theta2": self.theta2.tolist(),
                "b1": self.input_layer_bias.tolist(), "b2": self.hidden_layer_bias.tolist()
            }, f)

    def _load(self):
        with open(self.NN_FILE_PATH, 'r') as f:
            nn = json.load(f)
        self.theta1 = np.array(nn['theta1'])
        self.theta2 = np.array(nn['theta2'])
        self.input_layer_bias = np.array(nn['b1'])
        self.hidden_layer_bias = np.array(nn['b2'])