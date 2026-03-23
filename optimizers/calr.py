import torch
from torch.optim import Optimizer

class CALR(Optimizer):
    def __init__(self,params,lr=1e-3,betas=(0.9,0.999),eps=1e-8,alpha=0.1,delta=1e-6):
        defaults=dict(lr=lr,betas=betas,eps=eps,alpha=alpha,delta=delta)
        super(CALR,self).__init__(params,defaults)

    def step(self,closure=None):
        loss=None
        if closure is not None:
            loss=closure()
        
        for group in self.param_groups:
            lr=group["lr"]
            beta1,beta2=group["betas"]
            eps=group["eps"]
            alpha=group["alpha"]
            delta=group["delta"]

            for p in group["params"]:
                if p.grad is None:
                    continue

                grad=p.grad.data

                state=self.state[p]
                if len(state) == 0 :
                    state["step"]=0
                    state["m"]=torch.zeros_like(p.data)
                    state["v"]=torch.zeros_like(p.data) 
                
                m,v = state["m"],state["v"]

                state["step"]+=1
                t=state["step"]

                m.mul_(beta1).add_(grad,alpha=1-beta1)
                v.mul_(beta2).addcmul_(grad,grad,value=1-beta2)

                m_hat=m/(1-beta1**t)
                v_hat=v/(1-beta2**t)

                h_t=torch.abs(grad)+delta
                denom=torch.sqrt(v_hat+alpha*h_t+eps)

                p.data.addcdiv_(m_hat,denom,value=-lr)

        return loss



                 