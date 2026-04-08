def make_closure(model, optimizer, criterion, data, target):
    def closure():
        optimizer.zero_grad(set_to_none=True)
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        return loss
    return closure