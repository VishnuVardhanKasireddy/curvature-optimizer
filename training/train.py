import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets,transforms
import yaml
from models.mlp import MLP
from optimizers.calr import CALR

def load_config():
    with open("configs/config.yaml","r") as f:
        return yaml.safe_load(f)
    
def get_data_loader(batch_size):
    transform=transforms.ToTensor()

    train_dataset=datasets.MNIST(
        root="./data",
        train=True,
        download=True,
        transform=transform
    )

    return DataLoader(train_dataset,batch_size=batch_size,shuffle=True)

def get_optimizer(model,config):
    opt_name=config["optimizer"]["name"]
    lr=config["optimizer"]["lr"]

    if opt_name == "calr":
        return CALR(
            model.parameters(),
            lr=lr,
            alpha=config["optimizer"]["alpha"],
            delta = float(config["optimizer"]["delta"])
        )
    elif opt_name == "adam":
        return torch.optim.Adam(model.parameters(),lr=lr)
    else:
        raise ValueError("Unknown Optimizer")


def train():
    config=load_config()
    device=torch.device(config["training"]["device"])

    train_loader=get_data_loader(config["data"]["batch_size"])

    model=MLP().to(device)

    criterion=nn.CrossEntropyLoss()

    optimizer=get_optimizer(model,config)

    epochs=config["training"]["epochs"]

    for epoch in range(epochs):
        total_loss=0
        correct=0
        total=0
        for batch_idx,(data,target) in enumerate(train_loader):
            data,target=data.to(device),target.to(device)

            optimizer.zero_grad()

            output=model(data)
            loss=criterion(output,target)
            _,predicted=torch.max(output,1)
            correct+=(predicted==target).sum().item()
            total+=target.size(0)

            loss.backward()
            optimizer.step()

            accuracy=100*correct/total
            total_loss+=loss.item()
            avg_loss=total_loss/len(train_loader)
        print(f'Epoch [{epoch+1}/{epochs}] , Loss : {avg_loss:.4f} , Accuracy : {accuracy:.2f}%')


if __name__ == "__main__":
    train()
