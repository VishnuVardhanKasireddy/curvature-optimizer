from models.cnn import CNN
import torch

model = CNN()
x = torch.randn(4, 3, 32, 32)

output = model(x)
print(output.shape)  