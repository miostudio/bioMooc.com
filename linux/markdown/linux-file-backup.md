# 文件传输命令 scp

scp — OpenSSH secure file copy

SCP ：secure copy (remote file copy program) 

也是一个基于SSH安全协议的文件传输命令。与sftp不同的是，它只提供主机间的文件传输功能，没有文件管理的功能。

用法: `scp source_path1 target_path2`

- 把文件从 参数1 传递给 参数2。
	* 如果有一个是远程，则路径的写法是 `username@ip:/abs/path`
	* 传文件夹内的内容 要加 `-r`;
	* 经过测试，目录1和目录2后面是否加`/`对结果没影响，都是传目录1中的内容到目录2中;
	* 目录2如果不存在，则新建该目录，如果该目录的上级目录也不存在，则报错;
	* 如果路径中有空格，则必须使用双反斜杠 \\ 并将整个路径用引号引起来转义字符：`scp localFile1.txt user@192.168.1.102:"/file\\ path\\ with\\ spaces/remoteFile2.txt"`
	* 限制速度 -l: `$ scp -l 1000 文件名  账号@远程机器IP`，此时的传输速率就是1M／8＝100K左右。



## 1. 本地 to 远程
(1)复制local_file 到远程目录remote_folder下

`scp local_file remote_user@host:remote_folder`

(2)复制local_folder 到远程remote_folder（需要加参数 -r 递归）

`scp –r local_folder remote_user@host:remote_folder`


实例: `$ scp -r /home/wangjl/data/apa/191111Figure/f3/apaTracks wangjl@y.biomooc.com:/home/wangjl/igv/`

输入密码后，apaTracks目录内的内容就复制到 远程文件夹 igv/ 内了。





## 2. 远程 to 本地
以上命令反过来写就是远程复制到本地

(1)复制 远程 remote_folder 到本地目录 local_file 下

`scp remote_user@host:remote_folder local_file`

(2)复制 远程 remote_folder 到 本地 local_file （需要加参数 -r 递归）

`scp –r remote_user@host:remote_folder  local_folder`




## 报错: protocol error: mtime.sec not present

原因： 可能是 bashrc 中有echo语句，删掉或注释掉就可以了。

检查方式: `$ bash ~/.bashrc` 如果有输出，则肯定有echo语句。










# 文件完整性检查 md5sum

- md5sum 检查文件内容是否相同，与文件名无关
- md5sum值逐位校验，所以文件越大，校验时间越长
- 理论上不同文件md5值可能会相同，但这种概率极低
- 只能用于文件，不能用于文件夹



## 1. 生成校验码

```
$ cat a1.txt 
this
$ md5sum a1.txt 
9e7b964750cf0bb08ee960fce356b6d6  a1.txt
$ md5sum a1.txt >a1.md5

$ cat a1.md5 
9e7b964750cf0bb08ee960fce356b6d6  a1.txt
```




## 2. 进行校验

内容一致，则校验成功: OK
```
$ md5sum -c a1.md5 
a1.txt: OK
```

如果传输过程中少了一个字符，则校验失败: FAILED
```
$ cat a1.txt 
his

$ md5sum -c a1.md5 
a1.txt: FAILED
md5sum: WARNING: 1 computed checksum did NOT match
```

再添加一个t，内容和原来一样，就能通过校验了。








## 实例: 检查**测序原始数据**完整性的shell脚本

执行路径的要求：其二级目录有 md5 文件。
```
其二级目录内有 md5 文件
$ pwd
/data/to/fastq/raw/XX-20220617-L-01-2022-06-211426

$ tree 
.
├── Sample_R22021013-1234567_123-123_H
│   ├── R22021013-1234567_123-123_H_combined_R1.fastq.gz
│   ├── R22021013-1234567_123-123_H_combined_R1.fastq.gz.md5
│   ├── R22021013-1234567_123-123_H_combined_R2.fastq.gz
│   └── R22021013-1234567_123-123_H_combined_R2.fastq.gz.md5
├── Sample_R22021013-1234567_123-123_M
...
```

shell 脚本内容:
```
$ vim ~/bin/md5sum_fastqRaw.sh
# Aim: 依靠md5检查文件完整性
# 执行路径的要求：其二级目录有 md5 文件。$ shell ./md5sum_fastqRaw.sh
# version 0.1
#
# 1. in the current dir 
cur=`pwd`
echo "Current path:"${cur};

# 2. for each subdir
ls | while read subdir; do 
echo -e "\tsubpath:"${subdir};
abspath="${cur}/${subdir}";
cd $abspath;
  # 3. goto each subdir, get md5 file
  ls *md5 | while read file; do 
  # 4.check
  md5sum -c $file;
  done;
echo "";
done;
```

执行实例:
```
$ bash ~/bin/md5sum_fastqRaw.sh
Current path:/data/to/fastq/raw/XX-20220617-L-01-2022-06-211426
        subpath:Sample_R22021013-1234567_123-123_H
R22021013-1234567_123-123_H_combined_R1.fastq.gz: OK
R22021013-1234567_123-123_H_combined_R2.fastq.gz: OK

        subpath:Sample_R22021013-1234567_123-123_L
R22021013-1234567_123-123_L_combined_R1.fastq.gz: OK
R22021013-1234567_123-123_L_combined_R2.fastq.gz: OK
...
```

如果都是 OK 表示校验通过。




