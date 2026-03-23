import torch
from optimizers.calr import CALR

x=torch.tensor([0.5],requires_grad=True)
optimizer=CALR([x],lr=0.1)

for i in range(50):
    loss=x**2
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    if i%5==0:
        print(f'Step [{i}]: x={x.item():.4f} , loss={loss.item():.4f}')

    
