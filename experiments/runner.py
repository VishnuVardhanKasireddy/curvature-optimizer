import torch

def run_optimizer(optimizer_class, func, init, steps=200, lr=0.01,**kwargs):
    x = torch.tensor(init, dtype=torch.float32, requires_grad=True)

    optimizer = optimizer_class([x], lr=lr,**kwargs)

    history = []

    for _ in range(steps):
        optimizer.zero_grad()

        loss = func(x)
        loss.backward()

        optimizer.step()

        history.append(loss.item())

    return history