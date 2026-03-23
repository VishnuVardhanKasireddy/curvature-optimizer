import torch
from models.mlp import MLP

x=torch.randn(4,1,28,28)

model=MLP()
output=model(x)

print("OutShape : ",output.shape)