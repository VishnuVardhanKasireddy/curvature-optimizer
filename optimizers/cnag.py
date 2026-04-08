import torch
from torch.optim import Optimizer


class CALR_NAG(Optimizer):
    def __init__(self, params, lr=1e-3, betas=(0.9, 0.999), eps=1e-8, alpha=0.1, delta=1e-6):
        defaults = dict(lr=lr, betas=betas, eps=eps, alpha=alpha, delta=delta)
        super(CALR_NAG, self).__init__(params, defaults)

        # For train loop detection
        self.requires_closure = True

    def step(self, closure=None):
        if closure is None:
            raise RuntimeError("CALR-NAG requires closure")

        # =========================
        # 1. LOOKAHEAD (no grad)
        # =========================
        with torch.no_grad():
            for group in self.param_groups:
                beta1 = group["betas"][0]

                for p in group["params"]:
                    state = self.state[p]

                    # Initialize state for ALL params
                    if len(state) == 0:
                        state["step"] = 0
                        state["m"] = torch.zeros_like(p)
                        state["v"] = torch.zeros_like(p)

                    v_prev = state["m"].clone()
                    state["v_prev"] = v_prev

                    # Lookahead move
                    p.add_(v_prev, alpha=-beta1)

        # =========================
        # 2. COMPUTE GRAD (with grad)
        # =========================
        loss = closure()

        # =========================
        # 3. RESTORE PARAMETERS (no grad)
        # =========================
        with torch.no_grad():
            for group in self.param_groups:
                beta1 = group["betas"][0]

                for p in group["params"]:
                    state = self.state[p]

                    if "v_prev" not in state:
                        continue

                    v_prev = state["v_prev"]

                    # Restore original position
                    p.add_(v_prev, alpha=beta1)

        # =========================
        # 4. PARAMETER UPDATE (no grad)
        # =========================
        with torch.no_grad():
            for group in self.param_groups:
                lr = group["lr"]
                beta1, beta2 = group["betas"]
                eps = group["eps"]
                alpha = group["alpha"]
                delta = group["delta"]

                for p in group["params"]:
                    if p.grad is None:
                        continue

                    grad = p.grad
                    state = self.state[p]
                    m, v = state["m"], state["v"]

                    state["step"] += 1
                    t = state["step"]

                    # Adam-style moments
                    m.mul_(beta1).add_(grad, alpha=1 - beta1)
                    v.mul_(beta2).addcmul_(grad, grad, value=1 - beta2)

                    # Bias correction
                    m_hat = m / (1 - beta1 ** t)
                    v_hat = v / (1 - beta2 ** t)

                    # CALR curvature term
                    h_t = grad.abs() + delta

                    denom = (v_hat + alpha * h_t).sqrt().add_(eps)

                    # Parameter update
                    p.addcdiv_(m_hat, denom, value=-lr)

                    # Clean temporary state
                    state.pop("v_prev", None)

        return loss