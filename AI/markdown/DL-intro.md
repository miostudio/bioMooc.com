# 1. DL 概念介绍

神经网络，隐藏层，权重，卷积层，Pooling(池化层)，正则化层，全连接层，学习效率，激活函数，softmax。CNN, RNN, GNN, Transformer

## Hidden layer

首尾之外的层，都叫做中间层，也叫隐藏层。



## CONV(Convolutional Layer)



## POOL(Pooling Layer)
输入周围几个值，输出一个值，一般有 Max pool(默认)，Mean等。

有人建议舍弃池化层，而是用重复的卷积层代替。

舍弃池化层对训练好的生成网络也很重要：比如variational autoencoders (VAEs) or generative adversarial networks (GANs).

未来的体系结构可能会以很少甚至没有池化层为特征。



## FC(Fully-Connected Layer)


## 激活函数

使用激活函数，是为网络引入非线性。

四种常用的激活函数：Sigmoid、Tanh、ReLU和Softmax。[Figures](https://www.51cto.com/article/777787.html)

```
# 正数返回本身，否则返回0
def relu(x):
	return (x>0)*x


# S型函数
def sigmoid(x):
	return 1/(1+exp(-x))

# tanh
def tanh(x):
	return (1-exp(-2*x))/(1+exp(-2*x))


# softmax 函数，常用于多分类问题: exp(ai)/sigma( exp(ak) )
def softmax(x):
	x=exp(x)
	total=sum(x)
	out=[]
	for i in range(len(x)):
		out.append(x[i]/total)
	return out;
```



## 梯度下降


## 前向传播(Forward propagation)


## 反向传播(Backpropagation)



## 损失曲线和准确率曲线

神经网络的预测accuracy取决于其weights and biases.



## 过拟合(overfitting)

模拟只能识别已经训练的数据，而对于新的数据分辨能力很差。

说明模型仅仅是“记住”了输入数据，而不是学习到了输入数据的特征，导致模型缺乏泛化能力。

在训练期间应用诸如dropout，早期停止，数据增强，转移学习等正则化（Regularization）方法来对抗过度拟合。



## 正则化(Dropout)

Dropout是一种流行的神经网络正则化技术。 深度神经网络特别容易过度拟合。

Dropout是一种技术，在每次梯度下降迭代期间，我们删除一组随机选择的节点。 这意味着我们随机忽略一些节点，就好像它们不存在一样。








## 超参数(hyper-parameter)
一些需要手工设置和优化的全局参数。根据经验和效果调整，没有严格的数学推导。

### 学习速率(lr，也写作alpha)
防止权重变动太大出现震荡，对权重的增量乘以一个系数alpha，可能跨越几个数量级，一般从0.001，0.01，0.1到10尝试。

### 批次数量(batch_size)
取训练集的一个小批次进行训练，取其权重增量的平均值，对权重做一次更新。这样能加速训练过程，一定程度对抗过拟合。









# 高级概念

## 计算图(Computational Graphs)

计算图被定义为有向图，其中节点对应于数学运算。 计算图是表达和评估数学表达式的一种方式。



## variational autoencoders (VAEs)


## generative adversarial networks (GANs)


