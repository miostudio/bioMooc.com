# 远程同步命令 rsync: 增量备份 + 保留元数据

- ‌元数据保留：-a参数可完整保留权限、时间戳等属性。‌‌我认为是 rsync 的精髓，可以代替cp命令。
- 要在tmux中执行，防止网络波动。

## 1. rsync 核心语句

- 传输的双方都必须安装 rsync。

安装：

```
# Debian
$ sudo apt-get install rsync

# Red Hat
$ sudo yum install rsync
```


使用：

```
$ rsync -r source destination
上面命令中，-r表示递归，即包含子目录。
注意，-r是必须的，否则 rsync 运行不会成功。
source目录表示源目录，destination表示目标目录。

如果有多个文件或目录需要同步，可以写成下面这样。
$ rsync -r source1 source2 destination
```


或者写成脚本，类似：
```
$ src=/data/wangjl/tmp/   #源目录，from
$ des=/datapool/jinlab/wangjl/tmp/  #目标目录，to

$ rsync -av ${src} ${des}
或者
$ rsync -avzP --delete ${src} ${des}

参数解释：
-a可以递归、同步元数据（修改时间、权限等）
-v参数输出详细过程
-z: 传输时进行压缩提高效率
-P：显示文件传输的进度信息

--delete 当源目录中的文件删除，同步后目标目录中的文件也会被删除
	酌情使用，如果为了保持绝对一致，建议加上。
```


## 2. 我的自动备份脚本实例

```
$ vim back_logs/backup_scPolyA-seq2_monthly.sh
src=/data/wangjl/scPolyA-seq2/
des=/datapool/wangjl/scPolyA-seq2/
rsync -avzP ${src} ${des} | tee -a ${des}/back_logs/sync.data2picb.$(date +%Y%m%d\-%H%M%S).log

放到tmux中执行，首次可能要过夜(24MB/s)，以后之同步增量变化，会越来越快。
$ bash back_logs/backup_scPolyA-seq2_monthly.sh
一个月执行一次。
```


## 3. 细微区别: 路径结尾是否加/符号

如果只想同步源目录source里面的内容到目标目录destination，则需要在源目录后面加上斜杠。

$ rsync -a source/ destination

上面命令执行后，source目录里面的内容，就都被复制到了destination目录里面，并不会在destination下面创建一个source子目录。

```
$ rsync dir1 dir2/  #是把dir1 复制到 dir2/ 下，最后的结果是 dir2/dir1 结构。
$ rsync dir1/ dir2/  #是把dir1/的内容复制到 dir2/ 下，两个文件夹的内容完全一致。
```

## 4. 默认保留软连接，如果要求复制文件，而不是软连接本身

-L 或 --copy-links 参数会让 rsync 复制软链接指向的实际文件或目录内容，而不是保留软链接。



## 5. 只传输带有某个关键词的文件: --exclude 排除参数, --include 包含参数

```
$ src=/home/liyh/data3/newRNAseq_analysis/rawdata/
$ des=wangjl@gate1.picb.ac.cn:/picb/jinlab/wangjl/wangjl_hair/

$ rsync -avzP --copy-links --include='*wangjunliang*' --exclude='*' ${src} ${des}
```

注意：

-	顺序很重要：--include 和 --exclude 的顺序会影响结果。--include 必须放在 --exclude 之前。
-	目录处理：如果 wangjunliang 是目录名的一部分，rsync 会递归传输该目录及其内容。

传输前查询大小：只统计带某关键词的文件
```
	$ find ./ -type f -name '*wangjunliang*' -exec du -ch {} + | grep total$
	149G    total

	参数解释：
		find /source/path/：在 /source/path/ 目录下查找文件。
		-type f：只查找文件（不包括目录）。
		-name '*wangjunliang*'：匹配文件名中包含 wangjunliang 的文件。
		-exec du -ch {} +：对找到的文件执行 du -ch 命令，计算大小并显示总计。
		grep total$：过滤输出，只显示总计行。

或者 使用 rsync 的 --dry-run 选项
	$ rsync -avzP --copy-links --include='*wangjunliang*' --exclude='*' --dry-run ${src} ${des} | grep 'total size'
	Try 'dirname --help' for more information.
	total size is 172,981,478,618  speedup is 93,050,822.28 (DRY RUN)
	=> 172981478618/1024**3=161 G，似乎对不上。
```


更多实例：
```
实例1：只要 merge 开头的文件夹，比如 merge1/, merge2/，其他不要:
$ rsync -avzP --include='merge*/' --exclude='*/' ./ liuyulei@gate1.picb.ac.cn:/picb/jinlab/liuyulei/data/rawdata/

实例2：只要T_开头和N_开头的文件（10x的fastq文件）:
$ rsync -avzP --include='T_*' --include='N_*' --exclude='*' ./ zhumengxuan@gate1.picb.ac.cn:/picb/jinlab/zhumengxuan/pdyan/
```






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




## 批量获取 fastq.gz 文件的md5验证码

```
@193$ ls *fastq.gz | while read id; do echo `md5sum $id`; done > ~/yanpd.md5

只要T_和N_开头的文件:
@193$ ls *fastq.gz | grep -e "^T_" -e "^N_" | while read id; do echo `md5sum $id`; done > ~/yanpd.md5
```

然后拷贝该给对方进行完整性验证。

`$ md5sum -c yanpd.md5`

