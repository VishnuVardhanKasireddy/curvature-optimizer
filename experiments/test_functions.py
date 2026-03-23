import torch
import matplotlib.pyplot as plt

import torch
from optimizers.calr import CALR
from experiments.functions import quadratic, rosenbrock, himmelblau
from experiments.runner import run_optimizer
import pandas as pd
import os

functions = {
    "quadratic": quadratic,
    "rosenbrock": rosenbrock,
    "himmelblau": himmelblau
}

os.makedirs("results/benchmark", exist_ok=True)


def save_results(name, history):
    df = pd.DataFrame({
        "iteration": list(range(len(history))),
        "loss": history
    })
    df.to_csv(f"results/benchmark/{name}.csv", index=False)


def run_experiment():
    for name, func in functions.items():
        print(f"Running {name}...")

        calr = run_optimizer(CALR, func, [2.0, 2.0],alpha=1.0)
        adam = run_optimizer(torch.optim.Adam, func, [2.0, 2.0])
        sgd = run_optimizer(torch.optim.SGD, func, [2.0, 2.0])

        save_results(f"{name}_calr", calr)
        save_results(f"{name}_adam", adam)
        save_results(f"{name}_sgd", sgd)

    print("All benchmark results saved!")


if __name__ == "__main__":
    run_experiment()