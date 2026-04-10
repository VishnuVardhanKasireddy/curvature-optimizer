import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets,transforms
import yaml
import pandas as pd
import os
from models.mlp import MLP
from models.cnn import CNN
from optimizers.calr import CALR
from optimizers.cnag import CALR_NAG
from utils.metrics import calculate_accuracy
from utils.seed import set_seed
from utils.logger import log_epoch
from utils.closure import make_closure
from utils.grad import compute_grad_norm


set_seed(42)


def load_config():
    with open("configs/config.yaml","r") as f:
        return yaml.safe_load(f)
    
def get_data_loader(dataset_name, batch_size):
    transform = transforms.Compose([
        transforms.ToTensor()
    ])

    if dataset_name == "MNIST":
        dataset = datasets.MNIST(
            root="./data",
            train=True,
            download=True,
            transform=transform
        )
    elif dataset_name == "CIFAR10":
        dataset = datasets.CIFAR10(
            root="./data",
            train=True,
            download=True,
            transform=transform
        )
    else:
        raise ValueError("Unknown dataset")

    return DataLoader(dataset, batch_size=batch_size, shuffle=True)

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
    elif opt_name == "cnag":
        return CALR_NAG(
            model.parameters(),
            lr=lr,
            alpha=config["optimizer"]["alpha"],
            delta = float(config["optimizer"]["delta"])
        )
    elif opt_name == "adam":
        return torch.optim.Adam(model.parameters(),lr=lr)
    elif opt_name == "sgd":
        return torch.optim.SGD(model.parameters(),lr=lr,momentum=0.0)
    elif opt_name == "rmsprop":
        return torch.optim.RMSprop(
            model.parameters(),
            lr=lr,
            alpha=0.99,
            eps=1e-8,
            momentum=0.0    
        )
    else:
        raise ValueError("Unknown Optimizer")


def train():
    config=load_config()
    device=torch.device(config["training"]["device"])

    train_loader = get_data_loader(
        config["data"]["dataset"],
        config["data"]["batch_size"]
    )

    if config["model"]["type"] == "mlp":
        model = MLP().to(device)
    elif config["model"]["type"] == "cnn":
        model = CNN().to(device)
    else:
        raise ValueError("Unknown model")

    criterion=nn.CrossEntropyLoss()

    optimizer=get_optimizer(model,config)

    epochs=config["training"]["epochs"]
    loss_list=[]
    acc_list=[]
    epoch_grad_norms=[]
    
    for epoch in range(epochs):
        total_loss=0
        correct=0
        total=0
        grad_norm_list = []
        for batch_idx,(data,target) in enumerate(train_loader):
            data,target=data.to(device),target.to(device)

            opt_name = config["optimizer"]["name"]

            if opt_name == "cnag":
                closure=make_closure(model, optimizer, criterion, data, target)
                loss = optimizer.step(closure)
                grad_norm = compute_grad_norm(model)
                grad_norm_list.append(grad_norm)
                # Recompute output for accuracy 
                model.eval()
                with torch.no_grad():
                    output = model(data)
                model.train()

            else:
                optimizer.zero_grad()
                output = model(data)
                loss = criterion(output, target)
                loss.backward()
                grad_norm = compute_grad_norm(model)
                grad_norm_list.append(grad_norm)
                optimizer.step()

            # Accuracy (common for both cases)
            c, t = calculate_accuracy(output, target)
            correct += c
            total += t

            # Loss tracking
            total_loss += loss.item()
        avg_grad_norm = sum(grad_norm_list[-len(train_loader):]) / len(train_loader)
        epoch_grad_norms.append(avg_grad_norm)
        accuracy=100*correct/total
        avg_loss=total_loss/len(train_loader)
        loss_list.append(avg_loss)
        acc_list.append(accuracy)
        log_epoch(epoch+1, epochs, avg_loss, accuracy)
    
    os.makedirs("results",exist_ok=True)
    df = pd.DataFrame({
        "epoch": list(range(1, len(loss_list)+1)),
        "loss": loss_list,
        "accuracy": acc_list,
        "grad_norm": epoch_grad_norms
    })
    opt_name=config["optimizer"]["name"]
    if(config["data"]["dataset"]=="MNIST"):
        df.to_csv(f"results/{opt_name}_mnist_metrics.csv",index=False)
        print(f"Metrics saved to results/{opt_name}_mnist_metrics.csv")
    else:
        df.to_csv(f"results/{opt_name}_cifar_metrics.csv",index=False)
        print(f"Metrics saved to results/{opt_name}_cifar_metrics.csv")


if __name__ == "__main__":
    train()
