Transformer 的学习一定要围绕 Google 2017 的论文[《Attention is All you Need》](https://arxiv.org/abs/1706.03762)，建议下载最新版并打印，结合[B站李沐视频](https://www.bilibili.com/video/BV1pu411o7BE/?vd_source=826befc4ac0d0fa3b98deaa3efc7f800)，逐段阅读。

IBM 认为有两大创新: Positional encoding 和 Self-attention[2].



# 1. Encoder and Decoder stacks

解码器的输入是前一个解码器和最后一个编码器。
However, both the encoder and the decoder are actually a stack with multiple layers (same number for each). All encoders present the same structure, and the input gets into each of them and is passed to the next one. All decoders present the same structure as well and get the input from the last encoder and the previous decoder.




# 2. Attention


## Scaled Dot-Product Attention


## Multi-head Attention)


## Applications of Attention in our Model







# 3. Position-wise Feed-Forward Networks




# 4. Embeddings and Softmax





# 5. Positional Encoding




# 答疑

## Training: 有监督的训练

Transformer models are trained using supervised learning, where they learn to minimize a loss function that quantifies the difference between the model's predictions and the ground truth for the given task. Training typically involves optimization techniques like Adam or stochastic gradient descent (SGD).


## Inference: 对新数据进行推断

After training, the model can be used for inference on new data. During inference, the input sequence is passed through the pre-trained model, and the model generates predictions or representations for the given task.



## perplex
perplex [pəˈpleks] v. 使困惑，使茫然；使复杂化










# 相关资料

- [Attention Is All You Need, 2017](https://arxiv.org/abs/1706.03762)
- [2] https://www.ibm.com/think/topics/transformer-model
