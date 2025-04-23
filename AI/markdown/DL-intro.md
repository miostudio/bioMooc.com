# 1. DL 概念介绍

神经网络，隐藏层，权重，卷积层，Pooling(池化层)，正则化层，全连接层，学习效率，激活函数，softmax。CNN, RNN, GNN, Transformer


## 隐藏层 Hidden layer

首尾之外的层，都叫做中间层，也叫隐藏层。



## 卷积层 CONV(Convolutional Layer)

卷积层由若干卷积单元组成，每个卷积单元的参数都是通过反向传播算法最佳化得到的。

卷积运算的目的是提取输入的不同特征，第一层卷积层可能只能提取一些低级的特征如边缘、线条和角等层级，更多层的网路能从低级特征中迭代提取更复杂的特征。



## 池化层 POOL(Pooling Layer)

实际上是一种形式的降采样。输入周围几个值，输出一个值。
有多种不同形式的非线性池化函数，而其中“最大池化（Max pooling）”是最为常见的。

有人建议舍弃池化层，而是用重复的卷积层代替。
舍弃池化层对训练好的生成网络也很重要：比如variational autoencoders (VAEs) or generative adversarial networks (GANs).

未来的体系结构可能会以很少甚至没有池化层为特征。




## 全连接层 FC(Fully-Connected Layer)

全连接层（Fully Connected Layer），简称 FC 层，是人工神经网络中的基础层之一。

最早应用于多层感知机（MLP），其功能是将输入数据的所有特征映射到输出层，进行分类或回归等任务。全连接层是神经网络中的最后一层，也被称为“密集连接层”。

在全连接层中，输入的每个神经元都与输出的每个神经元相连接。全连接层通过对输入的线性变换和激活函数的非线性变换，将高维特征压缩或映射到目标维度。

y=f(W.x + b)

- W 权重矩阵
- x 输入向量
- b 偏置项 bias
- f 激活函数，如 ReLU, Sigmoid


* https://zhuanlan.zhihu.com/p/789336180



## 激活函数 (常见的四种，现在多用 ReLU)

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


## Softmax 层

y=exp(xi) / sum( exp(xi) )

作用是使大的更大，小的更小，且都是非负的，和为1，类似一系列概率值。




## 梯度下降 Gradient Descent

在求解损失函数的最小值时，可以通过梯度下降法来一步步的迭代求解，得到最小化的损失函数和模型参数值。

梯度就是损失函数的导数所指向的方向。

在机器学习中，基于基本的梯度下降法发展了两种梯度下降方法，分别为随机梯度下降法和批量梯度下降法。




## 前向传播(Forward propagation)


## 反向传播(Backpropagation)



## 损失函数(loss function)

损失函数层（loss layer）用于决定训练过程如何来“惩罚”网络的预测结果和真实结果之间的差异，它通常是网络的最后一层。

各种不同的损失函数适用于不同类型的任务。例如，Softmax交叉熵损失函数常常被用于在K个类别中选出一个，而Sigmoid交叉熵损失函数常常用于多个独立的二分类问题。欧几里德损失函数常常用于结果取值范围为任意实数的问题。






## 损失曲线和准确率曲线

神经网络的预测accuracy取决于其weights and biases.



## 过拟合(overfitting)

模拟只能识别已经训练的数据，而对于新的数据分辨能力很差。

说明模型仅仅是“记住”了输入数据，而不是学习到了输入数据的特征，导致模型缺乏泛化能力。

在训练期间应用诸如dropout，早期停止，数据增强，转移学习等正则化（Regularization）方法来对抗过度拟合。



## 正则化(Regularization: Dropout)

Dropout是一种流行的神经网络正则化技术。 深度神经网络特别容易过度拟合。

Dropout是一种技术，在每次梯度下降迭代期间，我们删除一组随机选择的节点。 这意味着我们随机忽略一些节点，就好像它们不存在一样。








## 超参数(hyper-parameter)
一些需要手工设置和优化的全局参数。根据经验和效果调整，没有严格的数学推导。

### 学习速率(lr，也写作alpha)
防止权重变动太大出现震荡，对权重的增量乘以一个系数alpha，可能跨越几个数量级，一般从0.001，0.01，0.1到10尝试。

### 批次数量(batch_size)
取训练集的一个小批次进行训练，取其权重增量的平均值，对权重做一次更新。这样能加速训练过程，一定程度对抗过拟合。









# 高级概念

- 一些特殊的模型
- 具体领域(自然语言、图像、语音)的专业术语。



## token

Token is parts of the input such as words or subword pieces in NLP.

- https://platform.openai.com/tokenizer




## 残差网络 ResNet

- https://www.bilibili.com/video/BV1bV41177ap/
- https://blog.csdn.net/a8039974/article/details/142202414

通过残差连接（residual connections）解决了深层网络训练中的梯度消失和梯度爆炸问题，使得网络可以训练得更深，性能更强。

原来的问题：在深度学习中，退化现象主要指的是随着神经网络层数的增加，网络性能反而下降的情况。

实现方法：y=f(x) + x;  就是通过某1或几个层后的输出，再加上原来的输入，然后再进入激活函数。这个 f(x) 可以视为 y-x 的残差。






## 计算图(Computational Graphs)

计算图被定义为有向图，其中节点对应于数学运算。 计算图是表达和评估数学表达式的一种方式。



## variational autoencoders (VAEs)


## generative adversarial networks (GANs)


## 混合专家模型(Mixture of Experts, MOE)

混合专家模型（Mixture of Experts，MoE）是一种先进的神经网络架构，旨在通过整合多个模型或“专家”的预测来提升整体模型性能。MoE模型的核心思想是将输入数据分配给不同的专家子模型，然后将所有子模型的输出进行合并，以生成最终结果。这种分配可以根据输入数据的特征进行动态调整，确保每个专家处理其最擅长的数据类型或任务方面，从而实现更高效、准确的预测。



