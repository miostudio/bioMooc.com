# pysam 概述

https://pysam.readthedocs.io/en/latest/index.html

Pysam is a python module for reading, manipulating and writing genomic data sets.

一般在交互模式(或jupyter)探索，在脚本模式下批量执行。



# 1.版本号

```
bam要先做index。
$ python3 -V
Python 3.7.3

$ pip3 list | grep pysam
pysam            0.19.1
```



# 2.读写bam文件
```
$ python3
>>> import pysam
>>> bamFile="/home/wangjl/data/chenxi/batch0/trim/ref_R2_extracted_trimmed_CutA_Aligned.sortedByCoord.out.bam"
>>> samfile = pysam.AlignmentFile(bamFile, "rb")
>>> for line in samfile:
...     print(line)
...     break
... 
A00679:526:HYVNJDSXY:4:2270:29658:29465_TAATCGGG_ATGGGGGCGA	0	0	3132264	255	20M7S	-1	-1	20	TATATAAATAGTTTAATTTTTGACAAT	array('B', [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37])	[('NH', 1), ('HI', 1), ('AS', 19), ('nM', 0)]
```



## (1)获取一行，这是一个AlignedSegment对象，有属性和方法
```
>>> line
<pysam.libcalignedsegment.AlignedSegment object at 0x7fb5c01618e8>
>>> type(line)
<class 'pysam.libcalignedsegment.AlignedSegment'>

>>> dir(line)
['__class__', '__copy__', '__deepcopy__', '__delattr__', '__dir__', '__doc__', ...

>>> help(line)
Help on AlignedSegment object:
...
```



## (2) 把一行转为字典，方便获取信息
```
>>> line.to_dict()
{'name': 'A00679:526:HYVNJDSXY:4:2270:29658:29465_TAATCGGG_ATGGGGGCGA', 'flag': '0', 'ref_name': 'chr1', 'ref_pos': '3132265', 'map_quality': '255', 'cigar': '20M7S', 'next_ref_name': '*', 'next_ref_pos': '0', 'length': '0', 'seq': 'TATATAAATAGTTTAATTTTTGACAAT', 'qual': 'FFFFFFFFFFFFFFFFFFFFFFFFFFF', 'tags': ['NH:i:1', 'HI:i:1', 'AS:i:19', 'nM:i:0']}

>>> line.to_dict().get("ref_name")
'chr1'

>>> line.to_dict()["ref_name"]
'chr1'
```



## (3) 读写bam文件
```
import pysam
samfile = pysam.AlignmentFile("ex1.bam", "rb") #读 bam 用 rb，读 sam 用 r;
pairedreads = pysam.AlignmentFile("allpaired.bam", "wb", template=samfile); #写 bam 用wb，写 sam 用w;
#for read in samfile.fetch():
for read in samfile:
    print(read)
    if read.is_paired:
        pairedreads.write(read)

pairedreads.close()
samfile.close()
```












# 3.获取bam的每一列

- https://pysam.readthedocs.io/en/latest/api.html

```
$ samtools view /home/wangjl/data/chenxi/batch0/trim/ref_R2_extracted_trimmed_CutA_Aligned.sortedByCoord.out.bam | head -n1
A00679:526:HYVNJDSXY:4:2270:29658:29465_TAATCGGG_ATGGGGGCGA	0	chr1	3132265	255	20M7S	*	0	0	TATATAAATAGTTTAATTTTTGACAAT	FFFFFFFFFFFFFFFFFFFFFFFFFFF	NH:i:1	HI:i:1	AS:i:19	nM:i:0
```


## (1) QNAME: fastq的序列名字
```
>>> line.qname
'A00679:526:HYVNJDSXY:4:2270:29658:29465_TAATCGGG_ATGGGGGCGA'

>>> line.query_name #推荐
'A00679:526:HYVNJDSXY:4:2270:29658:29465_TAATCGGG_ATGGGGGCGA'
```


## (2) FLAG: 判断正负链，0:"+", 16:"-"
```
>>> line.flag 
0
```


## (3) RNAME: 参考基因组名字
```
>>> line.rname
0

>>> line.reference_name #推荐
'chr1'

>>> line.to_dict().get("ref_name")
'chr1'
```



## (4) POS: 比对到的坐标位置(bam: 0-based)

samtools view xx.bam #1-based

参考基因组 reference:
```
>>> line.pos #废弃；使用 reference_start
3132264

>>> line.to_dict()["ref_pos"]
'3132265'

看官网，新版本:
aend: deprecated, use reference_end instead.
alen: deprecated, use reference_length instead.
pos: deprecated, use reference_start instead.

reference_length: aligned length of the read on the reference genome.
This is equal to reference_end - reference_start. Returns None if not available.


>>> line.reference_start
3132264

>>> line.reference_end
3132284

>>> line.reference_length
20
```



查询的reads序列 query: 一般不用
```
>>> line.query_alignment_start
0
>>> line.query_alignment_end
20
>>> line.query_alignment_length
20
```



## (5) MAPQ: 比对质量分数

```
>>> line.mapq
255

>>> line.mapping_quality #推荐
255
```





## (6) CIGAR: 比对状态字符串
```
>>> line.cigarstring #推荐
'20M7S'

>>> line.to_dict()["cigar"]
'20M7S'


>>> line.cigar #废弃
[(0, 20), (4, 7)]
>>> line.cigartuples #推荐
[(0, 20), (4, 7)]

## 对比 cigar 属性和 cigar字符串的关系，[]内的数组是(operation, length)形式。
# 第一个 operation 的对应关系是
# 0 M
# 1 I
# 2 D
# 3 N
# 4 S

## print("\t>>", i, line.to_dict()["cigar"], line.cigar)
	>> 0 34M1D103M [(0, 34), (2, 1), (0, 103)]
	>> 4 94M [(0, 94)]
	>> 23 2S129M [(4, 2), (0, 129)]
	>> 38 29M45059N18M [(0, 29), (3, 45059), (0, 18)]
	>> 56 27M5I109M [(0, 27), (1, 5), (0, 109)]


M	BAM_CMATCH	0
I	BAM_CINS	1
D	BAM_CDEL	2
N	BAM_CREF_SKIP	3
S	BAM_CSOFT_CLIP	4
H	BAM_CHARD_CLIP	5
P	BAM_CPAD	6
=	BAM_CEQUAL	7
X	BAM_CDIFF	8
B	BAM_CBACK	9

In the Python API, the cigar alignment is presented as a list of tuples (operation,length). 
For example, the tuple [ (0,3), (1,5), (0,2) ] refers to an alignment with 3 matches, 5 insertions and another 2 matches.
```





## (7-9) 双端测序的另一个read的信息: 参考基因组、位置、长度
```
## (7) RNEXT: 配对序列比对到的参考基因组 //todo
## (8) PNEXT: 配对序列比对到的位置 //todo
## (9) TLEN: 模板的长度 //todo
```


## (10) SEQ: 获取序列

```
# bam 中记录的序列 (bam中的序列永远和.fasta文件一致：正链和fq一致，负链则和fq的反向互补)
>>> line.seq  #废除；推荐 query_sequence
'TATATAAATAGTTTAATTTTTGACAAT'
>>> line.query_sequence #推荐
'TATATAAATAGTTTAATTTTTGACAAT'

The sequence is returned as it is stored in the BAM file. (This will be the reverse complement of the original read sequence if the mapper has aligned the read to the reverse strand.)



# 获取其 forward 序列，负链就是 seq，正链是其反向互序列。
>>> line.get_forward_sequence() #原 fastq的序列：return the original read sequence.
'TATATAAATAGTTTAATTTTTGACAAT'
```



## (11) QUAL: fastq中记录的测序质量分数

```
>>> line.query_qualities
array('B', [37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37, 37])

>>> line.to_dict().get("qual")
'FFFFFFFFFFFFFFFFFFFFFFFFFFF'
```



## (12) 获取末尾可选的 tag
```
>>> line.get_tags()
[('NH', 1), ('HI', 1), ('AS', 19), ('nM', 0)]
>>> line.get_tag("NH")
1
>>> line.has_tag("NH")
True
>>> line.has_tag("CB")
False
```









# 4.所有的属性和方法
```
>>> dir(line)
['__class__', '__copy__', '__deepcopy__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__ne__', '__new__', '__pyx_vtable__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__setstate__', '__sizeof__', '__str__', '__subclasshook__', 'aend', 'alen', 'aligned_pairs', 'bin', 'blocks', 'cigar', 'cigarstring', 'cigartuples', 'compare', 'flag', 'from_dict', 'fromstring', 'get_aligned_pairs', 'get_blocks', 'get_cigar_stats', 'get_forward_qualities', 'get_forward_sequence', 'get_overlap', 'get_reference_positions', 'get_reference_sequence', 'get_tag', 'get_tags', 'has_tag', 'header', 'infer_query_length', 'infer_read_length', 'inferred_length', 'is_duplicate', 'is_paired', 'is_proper_pair', 'is_qcfail', 'is_read1', 'is_read2', 'is_reverse', 'is_secondary', 'is_supplementary', 'is_unmapped', 'isize', 'mapping_quality', 'mapq', 'mate_is_reverse', 'mate_is_unmapped', 'mpos', 'mrnm', 'next_reference_id', 'next_reference_name', 'next_reference_start', 'opt', 'overlap', 'pnext', 'pos', 'positions', 'qend', 'qlen', 'qname', 'qqual', 'qstart', 'qual', 'query', 'query_alignment_end', 'query_alignment_length', 'query_alignment_qualities', 'query_alignment_sequence', 'query_alignment_start', 'query_length', 'query_name', 'query_qualities', 'query_sequence', 'reference_end', 'reference_id', 'reference_length', 'reference_name', 'reference_start', 'rlen', 'rname', 'rnext', 'seq', 'setTag', 'set_tag', 'set_tags', 'tags', 'template_length', 'tid', 'tlen', 'to_dict', 'to_string', 'tostring']



# 基本上没有下划线的都是不推荐的属性或方法
# 参考: https://pysam.readthedocs.io/en/latest/api.html
>>> line. #按tab键两次
line.aend                       line.is_proper_pair             line.query
line.alen                       line.is_qcfail                  line.query_alignment_end
line.aligned_pairs              line.is_read1                   line.query_alignment_length
line.bin                        line.is_read2                   line.query_alignment_qualities
line.blocks                     line.is_reverse                 line.query_alignment_sequence
line.cigar                      line.is_secondary               line.query_alignment_start
line.cigarstring                line.is_supplementary           line.query_length
line.cigartuples                line.is_unmapped                line.query_name
line.compare(                   line.isize                      line.query_qualities
line.flag                       line.mapping_quality            line.query_sequence
line.from_dict(                 line.mapq                       line.reference_end
line.fromstring(                line.mate_is_reverse            line.reference_id
line.get_aligned_pairs(         line.mate_is_unmapped           line.reference_length
line.get_blocks(                line.mpos                       line.reference_name
line.get_cigar_stats(           line.mrnm                       line.reference_start
line.get_forward_qualities(     line.next_reference_id          line.rlen
line.get_forward_sequence(      line.next_reference_name        line.rname
line.get_overlap(               line.next_reference_start       line.rnext
line.get_reference_positions(   line.opt(                       line.seq
line.get_reference_sequence(    line.overlap(                   line.setTag(
line.get_tag(                   line.pnext                      line.set_tag(
line.get_tags(                  line.pos                        line.set_tags(
line.has_tag(                   line.positions                  line.tags
line.header                     line.qend                       line.template_length
line.infer_query_length(        line.qlen                       line.tid
line.infer_read_length(         line.qname                      line.tlen
line.inferred_length            line.qqual                      line.to_dict(
line.is_duplicate               line.qstart                     line.to_string(
line.is_paired                  line.qual                       line.tostring( 
```






# 5. 常见问题解答 FAQ

- https://pysam.readthedocs.io/en/latest/faq.html

## (1) pysam 的坐标不对?

像python一样，pysam使用 基于0的坐标系统。pysam的坐标和区间都按照这个惯例。
pysam uses 0-based coordinates and the half-open notation for ranges as does python. Coordinates and intervals reported from pysam always follow that convention.


疑惑的起因可能是不同的文件有不同的惯例。
比如，sam格式是 基于1的，而bam是 基于0的。
要记住：pysam 总是自动转为 pysam 的惯例: 基于0的坐标。
Confusion might arise as different file formats might have different conventions. For example, the SAM format is 1-based while the BAM format is 0-based. It is important to remember that pysam will always conform to the python convention and translate to/from the file format automatically.


唯一的例外是：fetch() 和 pileup() 方法中的区域字符串。
这个区域字符串使用 samtools 命令行的惯例。直接传递给 samtools 命令行的也是这样，比如 pysam.mpileup().
The only exception is the region string in the fetch() and pileup() methods. This string follows the convention of the samtools command line utilities. The same is true for any coordinates passed to the samtools command utilities directly, such as pysam.mpileup().











# 参考

- https://pysam.readthedocs.io/en/latest/api.html

