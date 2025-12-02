# 磁盘常用命令


## df 查看磁盘使用百分比

```
$ df -lh
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        504G     0  504G   0% /dev
tmpfs           504G  156K  504G   1% /dev/shm
tmpfs           504G   95M  504G   1% /run
tmpfs           504G     0  504G   0% /sys/fs/cgroup
/dev/sda3       197G   45G  142G  25% /
/dev/sda1      1022M   12M 1011M   2% /boot/efi
/dev/sda2       234G  2.3G  220G   1% /local/home
/dev/nvme0n1p1  7.0T  3.1T  3.6T  46% /data
none            472T  304T  169T  65% /datapool
tmpfs           101G     0  101G   0% /run/user/5498
...
```


## lsblk 查看磁盘大小、分区、挂载点

```
$ lsblk
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda           8:0    0 446.6G  0 disk
├─sda1        8:1    0     1G  0 part /boot/efi
├─sda2        8:2    0 237.6G  0 part /local/home
├─sda3        8:3    0   200G  0 part /
└─sda4        8:4    0     8G  0 part [SWAP]
nvme0n1     259:0    0     7T  0 disk
└─nvme0n1p1 259:1    0     7T  0 part /data
```

可以看到当前系统有两块盘，分别是0.5T和7T，已分区，并挂载在某个目录上。




## fdisk 查看磁盘格式、文件类型、大小(需要root权限)

```
$ sudo fdisk -l
[sudo] password for wangjl:
WARNING: fdisk GPT support is currently new, and therefore in an experimental phase. Use at your own discretion.

Disk /dev/nvme0n1: 7681.5 GB, 7681501126656 bytes, 15002931888 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: gpt
Disk identifier: 7EDCA0F3-5CB5-4AE1-B68B-3685467C3348


#         Start          End    Size  Type            Name
 1         2048  15002931199      7T  Microsoft basic
WARNING: fdisk GPT support is currently new, and therefore in an experimental phase. Use at your own discretion.

Disk /dev/sda: 479.6 GB, 479559942144 bytes, 936640512 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 262144 bytes / 262144 bytes
Disk label type: gpt
Disk identifier: D243489A-5AED-43B7-8EE0-5BD535D1FB8E


#         Start          End    Size  Type            Name
 1         2048      2099199      1G  EFI System      EFI System Partition
 2      2099200    500430847  237.6G  Microsoft basic
 3    500430848    919861247    200G  Microsoft basic
 4    919861248    936638463      8G  Linux swap
```



## 查看当前目录下的文件夹大小: du -sh 命令

- du /home/wangjl  #这在/home/wangjl 目录及其每个子目录中显示了磁盘块数。
- du -s /home/wangjl/  #查看该目录的总大小
- du -sh *      #查看当前目录下的文件夹大小，使用人类友好的数据显示方式(用MB或者GB做结尾)


```
常用命令
$ du ./* -s | sort -k1nr #查看当前文件夹下的文件和文件夹大小，按照从大到小的顺序排列
如果不想看到 Permission denied 报错：
$ du ./* -s 2>/dev/null  | sort -k1nr 
```










# 实例：挂载硬盘/格式化硬盘为linux的 ext4 文件系统

- 使用场景：买了一块8T硬盘，想备份一下服务器中不常用的数据，怎么挂载该硬盘到linux系统上呢？
- 新买的硬盘一般是 windows 文件系统，不适合linux服务器。需要先确认没有重要数据，然后格式化为linux支持的格式。

> 磁盘操作不可逆，数据损失代价昂贵！！！一定要小心谨慎操作！！！


## 1) 查看该硬件的位置 /dev/?

```
$ sudo fdisk -l #根据大小推测是那一块盘

$ sudo fdisk -l | grep sdf -A10
$ sudo fdisk -l /dev/sdf
Disk /dev/sdf: 8001.6 GB, 8001562869760 bytes, 15628052480 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disk label type: gpt
Disk identifier: 34CA04EB-FA9B-41E3-950B-87B6BFE8D6C1
#         Start          End    Size  Type            Name
 1         2048  15628050431    7.3T  Microsoft basic My Book
```


## 2) 挂载前先看看该盘内的文件内容

如果是linux文件系统，则可以直接挂载使用。

如果不是，则要格式化成 linux文件系统。
	为了防止错误格式化，一定要先看一下硬件中的文件内容。

```
先新建文件夹
$ sudo mkdir /mnt/data5

尝试挂载：提示文件系统未知，挂载失败。
$ sudo mount /dev/sdf1 /mnt/data5
mount: unknown filesystem type 'exfat'
```

> 最好换个操作系统（比如Windows，Linux，MacOS都试一遍），反复确认磁盘数据，查看文件内容是否还需要。

如果是新买的盘，或者确定数据不需要了，就可以对硬盘分区、格式化了。


## 3) 转为linux文件分区 fdisk - manipulate disk partition table

```
$ sudo fdisk /dev/sdf
Command (m for help): m ##
Command action
   d   delete a partition
   g   create a new empty GPT partition table
   G   create an IRIX (SGI) partition table
   l   list known partition types
   m   print this menu
   n   add a new partition
   o   create a new empty DOS partition table
   p   print the partition table
   q   quit without saving changes
   s   create a new empty Sun disklabel
   t   change a partition's system id
   v   verify the partition table
   w   write table to disk and exit
   x   extra functionality (experts only)
Command (m for help): t ##
Selected partition 1
Partition type (type L to list all types): L ##
# 20 Linux filesystem               0FC63DAF-8483-4772-8E79-3D69D8477DE4
> 20
# Changed type of partition 'Microsoft basic data' to 'Linux filesystem'
> w
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

查看硬盘
```
$ sudo fdisk -l | grep sdf -A10
Disk /dev/sdf: 8001.6 GB, 8001562869760 bytes, 15628052480 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disk label type: gpt
Disk identifier: 34CA04EB-FA9B-41E3-950B-87B6BFE8D6C1
#         Start          End    Size  Type            Name
 1         2048  15628050431    7.3T  Linux filesyste My Book
```


## 4) 格式化分区为Ext4

```
$ sudo mkfs.ext4 /dev/sdf1  #等待几秒
mke2fs 1.42.9 (28-Dec-2013)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
244191232 inodes, 1953506048 blocks
97675302 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=4102029312
59617 block groups
32768 blocks per group, 32768 fragments per group
4096 inodes per group
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
	102400000, 214990848, 512000000, 550731776, 644972544, 1934917632

Allocating group tables: done                            
Writing inode tables: done                            
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done 
```


## 5) 挂载硬盘到linux系统
`$ sudo mount /dev/sdf1 /mnt/data5`

发现硬盘分区已经挂载到系统目录：
```
$ df -lh 
Filesystem   Size  Used Avail Use% Mounted on
/dev/sdf1    7.3T   93M  6.9T   1% /mnt/data5
```

查看文件系统格式，在第二列：
```
$ df -lhT
Filesystem   Type      Size  Used Avail Use% Mounted on
/dev/sdf1    ext4      7.3T   93M  6.9T   1% /mnt/data5
```

查看每个盘的分区
```
$ lsblk
NAME            MAJ:MIN RM   SIZE RO TYPE  MOUNTPOINT
sdf               8:80   0   7.3T  0 disk  
└─sdf1            8:81   0   7.3T  0 part  /mnt/data5
```


最后设置系统启动时自动加载(可选)
```
# cat /etc/fstab
/dev/sdf1 /mnt/data5 ext4 defaults 1 2 
```


## 6) 备份文件 

先用sudo新建一个文件夹，改为该用户的权限。
```
假设用户名为 zzhan，
$ cd /mnt/data5
$ sudo mkdir zzhan_data
$ sudo chown zzhan zzhan_data

$ ls -lth
drwxr-xr-x. 3 zzhan root 4.0K Dec  2 16:04 zzhan_data

然后用户就可以登录拷贝数据了。
	命令 cp 
	推荐命令 rsync
```


## 7) 卸载硬盘
```
$ sudo umount  /mnt/data5
此时不能在 /mnt/data5 目录下输入前面的卸载命令，要退出该磁盘外，否则系统会认为你的“设备忙”而拒绝卸载。

$ df -lhT
查看不到该硬件，再等待磁盘磁头复位。
等待一分钟左右，磁盘不再震动，指示灯熄灭，即可安全拔掉该硬件。
```

