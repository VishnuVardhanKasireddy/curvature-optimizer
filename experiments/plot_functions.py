import pandas as pd
import matplotlib.pyplot as plt

def plot_function(name):
    calr = pd.read_csv(f"results/benchmark/{name}_calr.csv")
    adam = pd.read_csv(f"results/benchmark/{name}_adam.csv")
    sgd = pd.read_csv(f"results/benchmark/{name}_sgd.csv")

    plt.figure()

    plt.plot(calr["iteration"], calr["loss"], label="CALR")
    plt.plot(adam["iteration"], adam["loss"], label="Adam")
    plt.plot(sgd["iteration"], sgd["loss"], label="SGD")

    plt.xlabel("Iterations")
    plt.ylabel("Loss")
    plt.title(f"{name.capitalize()} Optimization")
    plt.legend()
    plt.grid()

    plt.show()

if __name__ == "__main__":
    for func in ["quadratic", "rosenbrock", "himmelblau"]:
        plot_function(func)